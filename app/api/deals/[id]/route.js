import { neon } from '@neondatabase/serverless';

const getDbInstance = () => neon(process.env.DATABASE_URL);

export async function GET(request, { params }) {
  try {
    const db = getDbInstance();
    const { id } = params;
    
    const [deal] = await db('SELECT * FROM deal_trackers WHERE id = $1', [id]);
    if (!deal) return new Response(JSON.stringify(null), { status: 404 });
    
    const notes = await db('SELECT * FROM deal_notes WHERE deal_id = $1 ORDER BY created_at DESC', [id]);
    const tasks = await db('SELECT * FROM deal_tasks WHERE deal_id = $1 ORDER BY created_at ASC', [id]);
    const documents = await db('SELECT * FROM deal_documents WHERE deal_id = $1 ORDER BY created_at DESC', [id]);
    
    return new Response(JSON.stringify({ deal, notes, tasks, documents }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const db = getDbInstance();
    const { id } = params;
    const body = await request.json();
    
    if (body.action === 'add_note') {
      await db(
        'INSERT INTO deal_notes (deal_id, author, content, is_private) VALUES ($1, $2, $3, $4)',
        [id, body.author || 'admin', body.content, body.is_private ?? false]
      );
      return new Response(JSON.stringify({ status: 'note added' }), { status: 200 });
    }
    
    if (body.action === 'add_task') {
      await db(
        'INSERT INTO deal_tasks (deal_id, stage, title) VALUES ($1, $2, $3)',
        [id, body.stage, body.title]
      );
      return new Response(JSON.stringify({ status: 'task added' }), { status: 200 });
    }
    
    if (body.action === 'add_document') {
      await db(
        'INSERT INTO deal_documents (deal_id, stage, file_name, file_url, uploaded_by) VALUES ($1, $2, $3, $4, $5)',
        [id, body.stage, body.file_name, body.file_url, body.uploaded_by || 'admin']
      );
      return new Response(JSON.stringify({ status: 'document added' }), { status: 200 });
    }
    
    return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const db = getDbInstance();
    const { id } = params;
    const body = await request.json();
    
    if (body.action === 'toggle_task') {
      await db(
        'UPDATE deal_tasks SET is_complete = $1 WHERE id = $2',
        [body.is_complete, body.task_id]
      );
      return new Response(JSON.stringify({ status: 'task updated' }), { status: 200 });
    }
    
    if (body.action === 'delete_note') {
      await db('DELETE FROM deal_notes WHERE id = $1 AND deal_id = $2', [body.note_id, id]);
      return new Response(JSON.stringify({ status: 'note deleted' }), { status: 200 });
    }
    
    if (body.action === 'delete_document') {
      await db('DELETE FROM deal_documents WHERE id = $1 AND deal_id = $2', [body.doc_id, id]);
      return new Response(JSON.stringify({ status: 'document deleted' }), { status: 200 });
    }
    
    return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}