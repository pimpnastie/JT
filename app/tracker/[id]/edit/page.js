"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Save, FileText, CheckSquare, Square, Mail, Plus, ArrowLeft, Loader2, ClipboardList, Trash2, ExternalLink } from 'lucide-react';

export default function TrackerEditor() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [dataset, setDataset] = useState({ deal: {}, notes: [], tasks: [], documents: [] });

  const fetchFullFileDetails = async () => {
    const res = await fetch(`/api/deals/${id}`);
    if (res.ok) {
      const payload = await res.json();
      if (payload) setDataset(payload);
    }
    setLoading(false);
  };

  useEffect(() => { fetchFullFileDetails(); }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const content = e.target.content.value;
    const res = await fetch(`/api/deals/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_note', content, is_private: false })
    });
    if (res.ok) { e.target.reset(); fetchFullFileDetails(); }
    setProcessing(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const title = e.target.task_title.value;
    const stage = e.target.task_stage.value;
    const res = await fetch(`/api/deals/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_task', title, stage })
    });
    if (res.ok) { e.target.reset(); fetchFullFileDetails(); }
    setProcessing(false);
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const file_name = e.target.doc_name.value;
    const file_url = e.target.doc_url.value;
    const stage = e.target.doc_stage.value;
    const res = await fetch(`/api/deals/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_document', file_name, file_url, stage })
    });
    if (res.ok) { e.target.reset(); fetchFullFileDetails(); }
    setProcessing(false);
  };

  const toggleTaskState = async (taskId, currentStatus) => {
    await fetch(`/api/deals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_task', task_id: taskId, is_complete: !currentStatus })
    });
    fetchFullFileDetails();
  };

  const handleDeleteItem = async (actionType, itemIdKey, itemIdValue) => {
    const payload = { action: actionType };
    payload[itemIdKey] = itemIdValue;
    await fetch(`/api/deals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    fetchFullFileDetails();
  };

  if (loading) return <div className="bg-slate-950 min-h-screen flex items-center justify-center text-xs text-slate-500 tracking-widest uppercase font-bold animate-pulse">Accessing Secure Deal Asset Matrix...</div>;

  const currentStageFallback = dataset.deal?.current_stage || 'Mutual Acceptance';

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Control Header */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <div className="space-y-1">
            <Link href="/admin" className="text-slate-500 hover:text-white text-xs font-bold flex items-center gap-1 transition"><ArrowLeft size={12}/> Back to Admin Panel</Link>
            <h1 className="text-xl font-black uppercase text-white tracking-tight mt-1">Transaction Processing Engine</h1>
            <p className="text-xs text-slate-400 font-medium">{dataset.deal?.property_address} · Workspace ID Ref: XA-{id}</p>
          </div>
          <Link href={`/tracker/${id}`} className="text-xs font-black bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition uppercase tracking-wider shadow-md">Open Public View Portal</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Documents Locker Section */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-black uppercase text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-1.5"><FileText size={14} className="text-blue-500" /> Link Transaction Documents</h2>
              <form onSubmit={handleAddDocument} className="space-y-3 text-xs">
                <input name="doc_name" required placeholder="Document Name (e.g., Executed Sales Contract)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-slate-700 text-white" />
                <input name="doc_url" type="url" required placeholder="Google Drive / Dotloop Sharing URL" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-slate-700 text-white" />
                <select name="doc_stage" defaultValue={currentStageFallback} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-blue-400 font-bold outline-none">
                  <option>Mutual Acceptance</option>
                  <option>Home Inspection Period</option>
                  <option>Bank Appraisal Flight</option>
                  <option>Title Clear Search</option>
                  <option>Clear to Close 🎉</option>
                </select>
                <button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-3 rounded-xl transition text-[11px] tracking-wider">Bind Document URL</button>
              </form>
            </div>

            {/* Render Documents Linked */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Document Registry</h3>
              {dataset.documents.length === 0 ? (
                <div className="text-slate-600 font-bold text-[10px] uppercase py-4">No documents anchored to this transaction timeline file.</div>
              ) : (
                <div className="space-y-2">
                  {dataset.documents.map(d => (
                    <div key={d.id} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center gap-1.5">{d.file_name} <a href={d.file_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300"><ExternalLink size={12}/></a></div>
                        <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{d.stage}</span>
                      </div>
                      <button onClick={() => handleDeleteItem('delete_document', 'doc_id', d.id)} className="text-slate-600 hover:text-red-400 p-1 transition"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Tasks and Notes Sections */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Task Suite Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-black uppercase text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-1.5"><ClipboardList size={14} className="text-blue-500" /> Create Milestone Task</h2>
              <form onSubmit={handleAddTask} className="space-y-3 text-xs">
                <input name="task_title" required placeholder="Task Parameter (e.g., Verify Lender Appraisal Order)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-slate-700 text-white" />
                <select name="task_stage" defaultValue={currentStageFallback} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-blue-400 font-bold outline-none">
                  <option>Mutual Acceptance</option>
                  <option>Home Inspection Period</option>
                  <option>Bank Appraisal Flight</option>
                  <option>Title Clear Search</option>
                  <option>Clear to Close 🎉</option>
                </select>
                <button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-3 rounded-xl transition text-[11px] tracking-wider">Append Task Requirement</button>
              </form>
            </div>

            {/* Task Checklist Tracker */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Task Parameters Checklist</h3>
              {dataset.tasks.length === 0 ? (
                <div className="text-slate-600 font-bold text-[10px] uppercase py-4">No tasks configured.</div>
              ) : (
                <div className="space-y-2">
                  {dataset.tasks.map(t => (
                    <div key={t.id} className={`p-3 rounded-xl border flex items-start gap-3 transition ${t.is_complete ? 'bg-slate-950/40 border-slate-900 opacity-50' : 'bg-slate-950 border-slate-800'}`}>
                      <button onClick={() => toggleTaskState(t.id, t.is_complete)} className="mt-0.5 text-blue-400 shrink-0">
                        {t.is_complete ? <CheckSquare size={16} className="text-emerald-500" /> : <Square size={16} />}
                      </button>
                      <div className="text-xs space-y-0.5">
                        <h4 className={`font-bold text-white ${t.is_complete ? 'line-through text-slate-500' : ''}`}>{t.title}</h4>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold">{t.stage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Internal Correspondence & Notes */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-black uppercase text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-1.5"><Mail size={14} className="text-blue-500" /> Internal Deal Execution Journal</h2>
              <form onSubmit={handleAddNote} className="space-y-3 text-xs">
                <textarea name="content" required rows="3" placeholder="Paste tracking email summaries or telephone conversation items here..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-slate-700 text-slate-300 leading-relaxed" />
                <button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-2.5 rounded-xl transition text-[11px] tracking-wider">Log Journal Entry</button>
              </form>

              <div className="space-y-3 max-h-[220px] overflow-y-auto pt-2">
                {dataset.notes.map(n => (
                  <div key={n.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 text-xs relative group">
                    <p className="text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">{n.content}</p>
                    <div className="mt-2 flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      <span>By: {n.author} · {new Date(n.created_at).toLocaleDateString()}</span>
                      <button onClick={() => handleDeleteItem('delete_note', 'note_id', n.id)} className="text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"><Trash2 size={12}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}