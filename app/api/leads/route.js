import { neon } from '@neondatabase/serverless';

async function initializeTables(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT,
      category TEXT DEFAULT 'General Intake',
      status TEXT DEFAULT 'New',
      assigned_agent TEXT DEFAULT 'Unassigned',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS deal_trackers (
      id SERIAL PRIMARY KEY,
      lead_id INTEGER,
      client_name TEXT NOT NULL,
      property_address TEXT NOT NULL,
      current_stage TEXT DEFAULT 'Mutual Acceptance',
      is_at_risk BOOLEAN DEFAULT FALSE,
      risk_explanation TEXT,
      deal_side TEXT DEFAULT 'Seller',
      price_parameter NUMERIC DEFAULT 0,
      commission_rate NUMERIC DEFAULT 2.5,
      assigned_agent TEXT DEFAULT 'Jeremy Thieroff',
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await sql`ALTER TABLE deal_trackers ADD COLUMN IF NOT EXISTS deal_side TEXT DEFAULT 'Seller';`;
    await sql`ALTER TABLE deal_trackers ADD COLUMN IF NOT EXISTS price_parameter NUMERIC DEFAULT 0;`;
    await sql`ALTER TABLE deal_trackers ADD COLUMN IF NOT EXISTS commission_rate NUMERIC DEFAULT 2.5;`;
    await sql`ALTER TABLE deal_trackers ADD COLUMN IF NOT EXISTS assigned_agent TEXT DEFAULT 'Jeremy Thieroff';`;
    await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_agent TEXT DEFAULT 'Unassigned';`;
  } catch (schemaErr) {
    console.log("Migration columns verified:", schemaErr.message);
  }

  await sql`
    CREATE TABLE IF NOT EXISTS deal_notes (
      id SERIAL PRIMARY KEY,
      deal_id INTEGER REFERENCES deal_trackers(id) ON DELETE CASCADE,
      author TEXT DEFAULT 'admin',
      content TEXT NOT NULL,
      is_private BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS deal_tasks (
      id SERIAL PRIMARY KEY,
      deal_id INTEGER REFERENCES deal_trackers(id) ON DELETE CASCADE,
      stage TEXT NOT NULL,
      title TEXT NOT NULL,
      is_complete BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS deal_documents (
      id SERIAL PRIMARY KEY,
      deal_id INTEGER REFERENCES deal_trackers(id) ON DELETE CASCADE,
      stage TEXT,
      file_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      uploaded_by TEXT DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const sql = neon(process.env.DATABASE_URL);
    await initializeTables(sql);

    // Path A: Manual Admin Form Generation
    if (body.action === 'create_deal') {
      const result = await sql(
        'INSERT INTO deal_trackers (client_name, property_address, current_stage, deal_side, price_parameter, commission_rate, assigned_agent) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;',
        [body.client_name, body.property_address, body.current_stage, body.deal_side || 'Seller', body.price_parameter || 0, body.commission_rate || 2.5, body.assigned_agent || 'Jeremy Thieroff']
      );
      return new Response(JSON.stringify({ status: 'deal created', id: result[0].id }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Path B: Lead conversion handshake pipeline
    if (body.action === 'convert_lead') {
      await sql('UPDATE leads SET status = $1 WHERE id = $2;', ['Converted', body.lead_id]);
      const [leadProfile] = await sql('SELECT name, assigned_agent FROM leads WHERE id = $1;', [body.lead_id]);
      
      const result = await sql(
        'INSERT INTO deal_trackers (lead_id, client_name, property_address, current_stage, deal_side, assigned_agent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;',
        [body.lead_id, leadProfile.name, body.property_address || 'TBD Address', 'Mutual Acceptance', body.deal_side || 'Buyer', body.assigned_agent || 'Jeremy Thieroff']
      );
      return new Response(JSON.stringify({ status: 'success', id: result[0].id }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Path C: Public Landing Page Intake Drop Box
    await sql(
      'INSERT INTO leads (name, email, phone, message, category, status, assigned_agent) VALUES ($1, $2, $3, $4, $5, $6, $7);', 
      [body.name, body.email, body.phone, body.message, body.category || 'General Intake', 'New', 'Unassigned']
    );
    return new Response(JSON.stringify({ status: 'success' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const sql = neon(process.env.DATABASE_URL);
    await initializeTables(sql);
    
    if (body.action === 'reassign_agent') {
      await sql('UPDATE deal_trackers SET assigned_agent = $1, last_updated = CURRENT_TIMESTAMP WHERE id = $2;', [body.assigned_agent, body.id]);
      return new Response(JSON.stringify({ status: 'transfer complete' }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await sql(
      'UPDATE deal_trackers SET current_stage = $1, is_at_risk = $2, risk_explanation = $3, deal_side = $4, price_parameter = $5, commission_rate = $6, assigned_agent = $7, last_updated = CURRENT_TIMESTAMP WHERE id = $8;',
      [body.current_stage, body.is_at_risk, body.risk_explanation, body.deal_side, body.price_parameter, body.commission_rate, body.assigned_agent, body.id]
    );
    return new Response(JSON.stringify({ status: 'updated successfully' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    await initializeTables(sql);
    
    const leads = await sql("SELECT id, name, email, phone, message, status, category, assigned_agent FROM leads WHERE status != 'Converted' ORDER BY id DESC;");
    const deals = await sql('SELECT id, lead_id, client_name, property_address, current_stage, is_at_risk, risk_explanation, deal_side, price_parameter, commission_rate, assigned_agent FROM deal_trackers ORDER BY last_updated DESC;');
    
    return new Response(JSON.stringify({ leads, deals }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}