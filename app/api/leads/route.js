import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();
    const sql = neon(process.env.DATABASE_URL);
    
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT,
        status TEXT DEFAULT 'New Enquiry',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql('INSERT INTO leads (name, email, phone, message) VALUES ($1, $2, $3, $4);', [
      name,
      email,
      phone,
      message
    ]);
    
    return new Response(JSON.stringify({ status: 'success' }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const records = await sql('SELECT id, name, email, phone, message, status FROM leads ORDER BY id DESC;');
    return new Response(JSON.stringify(records), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}