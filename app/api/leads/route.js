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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS deal_trackers (
      id SERIAL PRIMARY KEY,
      client_name TEXT NOT NULL,
      property_address TEXT NOT NULL,
      current_stage TEXT DEFAULT 'Mutual Acceptance',
      is_at_risk BOOLEAN DEFAULT FALSE,
      risk_explanation TEXT,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const sql = neon(process.env.DATABASE_URL);
    await initializeTables(sql);

    // FIX: Appended 'RETURNING id' to grab the serial key on creation
    if (body.action === 'create_deal') {
      const result = await sql(
        'INSERT INTO deal_trackers (client_name, property_address, current_stage) VALUES ($1, $2, $3) RETURNING id;',
        [body.client_name, body.property_address, body.current_stage]
      );
      
      return new Response(JSON.stringify({ 
        status: 'deal created', 
        id: result[0].id 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await sql(
      'INSERT INTO leads (name, email, phone, message, category) VALUES ($1, $2, $3, $4, $5);', 
      [body.name, body.email, body.phone, body.message, body.category || 'General Intake']
    );
    return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, current_stage, is_at_risk, risk_explanation } = await request.json();
    const sql = neon(process.env.DATABASE_URL);
    
    await sql(
      'UPDATE deal_trackers SET current_stage = $1, is_at_risk = $2, risk_explanation = $3, last_updated = CURRENT_TIMESTAMP WHERE id = $4;',
      [current_stage, is_at_risk, risk_explanation, id]
    );
    return new Response(JSON.stringify({ status: 'updated successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    await initializeTables(sql);
    const leads = await sql('SELECT id, name, email, phone, message, status, category FROM leads ORDER BY id DESC;');
    const deals = await sql('SELECT id, client_name, property_address, current_stage, is_at_risk, risk_explanation FROM deal_trackers ORDER BY last_updated DESC;');
    return new Response(JSON.stringify({ leads, deals }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}