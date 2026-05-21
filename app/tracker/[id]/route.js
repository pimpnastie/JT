import { neon } from '@neondatabase/serverless';

// Ensures child meta tables exist for granular task tracking and tracking entries
async function initializeGranularTables(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS deal_meta (
      id SERIAL PRIMARY KEY,
      deal_id INT NOT NULL,
      notes TEXT DEFAULT '',
      mutual_doc TEXT DEFAULT '',
      inspection_doc TEXT DEFAULT '',
      appraisal_doc TEXT DEFAULT '',
      title_doc TEXT DEFAULT '',
      closing_doc TEXT DEFAULT '',
      last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS deal_tasks (
      id SERIAL PRIMARY KEY,
      deal_id INT NOT NULL,
      task_title TEXT NOT NULL,
      party_involved TEXT, -- 'Lender', 'Borough Manager', etc.
      status TEXT DEFAULT 'Pending', -- 'Pending', 'Completed'
      correspondence_log TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const sql = neon(process.env.DATABASE_URL);
    await initializeGranularTables(sql);
    
    const dealResult = await sql('SELECT * FROM deal_trackers WHERE id = $1;', [id]);
    if (!dealResult || dealResult.length === 0) return new Response(JSON.stringify(null), { status: 404 });

    // Grab matching child metadata and corresponding task lines
    let metaResult = await sql('SELECT * FROM deal_meta WHERE deal_id = $1;', [id]);
    if (metaResult.length === 0) {
      await sql('INSERT INTO deal_meta (deal_id) VALUES ($1);', [id]);
      metaResult = await sql('SELECT * FROM deal_meta WHERE deal_id = $1;', [id]);
    }
    
    const tasksResult = await sql('SELECT * FROM deal_tasks WHERE deal_id = $1 ORDER BY created_at DESC;', [id]);

    return new Response(JSON.stringify({
      core: dealResult[0],
      meta: metaResult[0],
      tasks: tasksResult
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const sql = neon(process.env.DATABASE_URL);
    await initializeGranularTables(sql);

    if (body.action === 'update_meta') {
      await sql`
        UPDATE deal_meta 
        SET notes = ${body.notes}, 
            mutual_doc = ${body.mutual_doc}, 
            inspection_doc = ${body.inspection_doc}, 
            appraisal_doc = ${body.appraisal_doc}, 
            title_doc = ${body.title_doc}, 
            closing_doc = ${body.closing_doc},
            last_modified = CURRENT_TIMESTAMP
        WHERE deal_id = ${id};
      `;
      return new Response(JSON.stringify({ status: 'meta updated' }), { status: 200 });
    }

    if (body.action === 'create_task') {
      await sql`
        INSERT INTO deal_tasks (deal_id, task_title, party_involved, correspondence_log, status)
        VALUES (${id}, ${body.task_title}, ${body.party_involved}, ${body.correspondence_log}, 'Pending');
      `;
      return new Response(JSON.stringify({ status: 'task created' }), { status: 200 });
    }

    if (body.action === 'toggle_task') {
      await sql`
        UPDATE deal_tasks SET status = ${body.status} WHERE id = ${body.task_id};
      `;
      return new Response(JSON.stringify({ status: 'task status toggled' }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Invalid action payload parameter' }), { status: 400 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}