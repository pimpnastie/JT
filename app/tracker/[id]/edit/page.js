"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Save, FileText, CheckSquare, Square, Mail, Plus, FileCode, ArrowLeft, Loader2, ClipboardList } from 'lucide-react';

export default function TrackerEditor() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dataset, setDataset] = useState({ core: {}, meta: {}, tasks: [] });

  const fetchFullFileDetails = async () => {
    const res = await fetch(`/api/leads/${id}`);
    if (res.ok) setDataset(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchFullFileDetails(); }, [id]);

  const handleMetaSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.target);
    await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_meta',
        notes: fd.get('notes'),
        mutual_doc: fd.get('mutual_doc'),
        inspection_doc: fd.get('inspection_doc'),
        appraisal_doc: fd.get('appraisal_doc'),
        title_doc: fd.get('title_doc'),
        closing_doc: fd.get('closing_doc'),
      })
    });
    setSaving(false);
    fetchFullFileDetails();
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_task',
        task_title: fd.get('task_title'),
        party_involved: fd.get('party_involved'),
        correspondence_log: fd.get('correspondence_log'),
      })
    });
    if (res.ok) { e.target.reset(); fetchFullFileDetails(); }
  };

  const toggleTaskState = async (taskId, currentStatus) => {
    const next = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_task', task_id: taskId, status: next })
    });
    fetchFullFileDetails();
  };

  if (loading) return <div className="bg-slate-950 min-h-screen flex items-center justify-center text-xs text-slate-500 tracking-widest uppercase font-bold animate-pulse">Accessing Secure Deal Vault Module...</div>;

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Structural Headers Control Row */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <div className="space-y-1">
            <Link href="/admin" className="text-slate-500 hover:text-white text-xs font-bold flex items-center gap-1 transition"><ArrowLeft size={12}/> Back to Master Panel</Link>
            <h1 className="text-xl font-black uppercase text-white tracking-tight mt-1">Transaction Processing Suite</h1>
            <p className="text-xs text-slate-400 font-medium">{dataset.core.property_address} · File Account target: {dataset.core.client_name}</p>
          </div>
          <Link href={`/tracker/${id}`} className="text-xs font-black bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition uppercase tracking-wider shadow-md">View Public Live Portal</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Block: Documents and Notes Core File Data */}
          <form onSubmit={handleMetaSave} className="lg:col-span-7 bg-slate-900 border border-slate-800/80 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5"><FileText size={14} className="text-blue-500" /> Document Repository & File Notes</h2>
              <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-slate-950 font-black px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1 transition shadow-sm">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save Changes
              </button>
            </div>

            {/* Structured File Notes Section */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Internal Deal Execution Notes</label>
              <textarea name="notes" defaultValue={dataset.meta.notes || ''} rows="5" placeholder="Log strategic file notes, client constraints, or partner friction data parameters..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-slate-700 leading-relaxed" />
            </div>

            {/* Document Step Link Binder Form Set */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 border-t border-slate-800/60 pt-4">Step-Specific Document Anchors (Google Drive/Dotloop URLs)</h3>
              
              {[
                { label: "Phase 1: Mutual Acceptance Contract Link", name: "mutual_doc" },
                { label: "Phase 2: Home Inspection Documentation Link", name: "inspection_doc" },
                { label: "Phase 3: Bank Appraisal Certificate Link", name: "appraisal_doc" },
                { label: "Phase 4: Title Clear Insurance Binder Link", name: "title_doc" },
                { label: "Phase 5: Closing Settlement Execution Statement Link", name: "closing_doc" },
              ].map((doc, idx) => (
                <div key={idx} className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">{doc.label}</label>
                  <input name={doc.name} type="url" defaultValue={dataset.meta[doc.name] || ''} placeholder="https://drive.google.com/drive/folders/..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 outline-none focus:border-slate-700" />
                </div>
              ))}
            </div>
          </form>

          {/* Right Block: Tasks and External Correspondence Tracking */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Log Task and Communications Input Module */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b border-slate-800/60 pb-3 flex items-center gap-1.5"><Mail size={14} className="text-blue-500" /> Log Task & Vendor Correspondence</h2>
              
              <form onSubmit={handleAddTask} className="space-y-3 text-xs">
                <input name="task_title" required placeholder="Task Title (e.g., Request Occupancy Permit)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-slate-700 text-white" />
                
                <select name="party_involved" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-slate-700 text-blue-400 font-bold">
                  <option>Cooperating Agent (Other Side)</option>
                  <option>Mortgage Lender / Underwriter</option>
                  <option>Title Settlement Closer</option>
                  <option>Borough / Municipal Manager</option>
                  <option>Independent Property Appraiser</option>
                  <option>Client Accounts</option>
                </select>

                <textarea name="correspondence_log" rows="2" placeholder="Paste relevant emails or log phone transcript metrics here..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-slate-700 text-slate-400" />
                
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider py-3 rounded-xl transition flex items-center justify-center gap-1">
                  <Plus size={14} /> Commit Event to Timeline
                </button>
              </form>
            </div>

            {/* Task Checklist Ledger Rendering View */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b border-slate-800/60 pb-3 flex items-center gap-1.5"><ClipboardList size={14} className="text-blue-500" /> Active Transaction Checklist</h2>
              
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {dataset.tasks.length === 0 ? (
                  <div className="text-center py-6 text-slate-600 font-bold uppercase tracking-widest text-[10px]">No execution records pinned to this transaction history file.</div>
                ) : (
                  dataset.tasks.map((task) => (
                    <div key={task.id} className={`p-3 rounded-xl border transition-all duration-150 flex gap-3 items-start ${task.status === 'Completed' ? 'bg-slate-950/40 border-slate-900/60 opacity-50' : 'bg-slate-950 border-slate-800'}`}>
                      <button type="button" onClick={() => toggleTaskState(task.id, task.status)} className="mt-0.5 shrink-0 text-blue-400 hover:text-blue-300">
                        {task.status === 'Completed' ? <CheckSquare size={16} className="text-emerald-500" /> : <Square size={16} />}
                      </button>
                      <div className="space-y-1 text-xs">
                        <span className="text-[9px] font-black tracking-widest uppercase bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded text-blue-400">{task.party_involved}</span>
                        <h4 className={`font-bold text-white ${task.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>{task.task_title}</h4>
                        {task.correspondence_log && (
                          <p className="text-[11px] text-slate-500 leading-relaxed italic border-l border-slate-800 pl-2 mt-1 whitespace-pre-wrap">{task.correspondence_log}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}