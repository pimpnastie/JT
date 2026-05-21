"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Save, FileText, CheckSquare, Square, Mail, Plus, ArrowLeft, ClipboardList, 
  Trash2, ExternalLink, DollarSign, Percent, User, Building, ShieldAlert, 
  EyeOff, Eye, FileSignature, CheckCircle2, RefreshCw 
} from 'lucide-react';

export default function TransactionWorkspaceEditor() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Master State Dataset Structure
  const [dataset, setDataset] = useState({ deal: {}, notes: [], tasks: [], documents: [] });

  // CRM Inline Variable Tracking States
  const [price, setPrice] = useState(0);
  const [commRate, setCommRate] = useState(2.5);
  const [dealSide, setDealSide] = useState('Seller');
  const [targetAddress, setTargetAddress] = useState('');
  const [currentStage, setCurrentStage] = useState('Mutual Acceptance');
  const [isAtRisk, setIsAtRisk] = useState(false);
  const [riskExplanation, setRiskExplanation] = useState('');

  const fetchFullFileDetails = async () => {
    try {
      const res = await fetch(`/api/deals/${id}`);
      if (res.ok) {
        const payload = await res.json();
        if (payload && payload.deal) {
          setDataset(payload);
          setPrice(payload.deal.price_parameter || 0);
          setCommRate(payload.deal.commission_rate || 2.5);
          setDealSide(payload.deal.deal_side || 'Seller');
          setTargetAddress(payload.deal.property_address || '');
          setCurrentStage(payload.deal.current_stage || 'Mutual Acceptance');
          setIsAtRisk(payload.deal.is_at_risk || false);
          setRiskExplanation(payload.deal.risk_explanation || '');
        }
      }
    } catch (err) {
      console.error("Failed to load workspace deal parameters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFullFileDetails(); }, [id]);

  // Handler 1: Core Deal Parameter Updates (Writes back through the main leads API put router)
  const handleSaveCoreMetadata = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          current_stage: currentStage,
          is_at_risk: isAtRisk,
          risk_explanation: riskExplanation,
          deal_side: dealSide,
          price_parameter: parseFloat(price) || 0,
          commission_rate: parseFloat(commRate) || 0,
          assigned_agent: dataset.deal?.assigned_agent || 'Jeremy Thieroff'
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchFullFileDetails();
      }
    } catch (err) {
      console.error("Failed to execute metadata commit block:", err);
    } finally {
      setProcessing(false);
    }
  };

  // Handler 2: Notes Entry (Supports both Private Admin Journals and Public Client Trackers)
  const handleAddJournalNote = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const content = e.target.content.value;
    const isPrivate = e.target.is_private.value === 'true';

    const res = await fetch(`/api/deals/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'add_note', 
        content, 
        is_private: isPrivate,
        author: dataset.deal?.assigned_agent || 'Admin' 
      })
    });
    if (res.ok) { e.target.reset(); fetchFullFileDetails(); }
    setProcessing(false);
  };

  // Handler 3: Per-Stage Task Checklist Additions
  const handleAddStageTask = async (e) => {
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

  // Handler 4: Document Upload URL Binds
  const handleAddDocumentAttachment = async (e) => {
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

  const toggleTaskCompleteState = async (taskId, currentStatus) => {
    await fetch(`/api/deals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_task', task_id: taskId, is_complete: !currentStatus })
    });
    fetchFullFileDetails();
  };

  const handleDeleteRelationalItem = async (actionType, idKeyName, targetIdValue) => {
    const payload = { action: actionType };
    payload[idKeyName] = targetIdValue;
    await fetch(`/api/deals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    fetchFullFileDetails();
  };

  if (loading) return <div className="bg-slate-950 min-h-screen flex items-center justify-center text-xs text-slate-500 tracking-widest uppercase font-bold animate-pulse">Synchronizing Escrow File Matrix Parameters...</div>;

  const grossRevenueYield = (price * (commRate / 100));
  const stages = [
    "Mutual Acceptance",
    "Home Inspection Period",
    "Bank Appraisal Flight",
    "Title Clear Search",
    "Clear to Close 🎉"
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Control Workspace Header */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <div className="space-y-1">
            <Link href="/admin" className="text-slate-500 hover:text-white text-xs font-bold flex items-center gap-1 transition">
              <ArrowLeft size={12}/> Return to Executive Command Dashboard
            </Link>
            <h1 className="text-xl font-black uppercase text-white tracking-tight mt-1">Transaction Management Workspace</h1>
            <p className="text-xs text-slate-400 font-medium">Assigned Representative: <span className="text-blue-400 font-bold">{dataset.deal?.assigned_agent || "Jeremy Thieroff"}</span></p>
          </div>
          <a href={`/tracker/${id}`} target="_blank" rel="noreferrer" className="text-xs font-black bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition uppercase tracking-wider shadow-md flex items-center gap-1.5">
            View Live Public Client Portal <ExternalLink size={14}/>
          </a>
        </div>

        {/* SECTION 1: MASTER FINANCIAL & LIFE-CYCLE MANAGEMENT CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500" />
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-800 pb-4 mb-6 gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Building size={16} className="text-blue-500"/> Core Escrow Parameters & Value Metrics
              </h2>
              <p className="text-xs text-slate-400">Modifying core file entries recalculates gross brokerage yield calculations dynamically.</p>
            </div>
            
            <div className="flex items-center gap-3 self-end lg:self-auto">
              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl animate-pulse">
                  ✓ Ledger Sync Complete
                </span>
              )}
              <button onClick={handleSaveCoreMetadata} disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md">
                <Save size={14}/> Save Pipeline Changes
              </button>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Client Legal Identity</label>
              <input type="text" disabled value={dataset.deal?.client_name || ''} className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-slate-500 cursor-not-allowed" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Contract Asset Address</label>
              <input type="text" value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Transaction Classification (Side)</label>
              <select value={dealSide} onChange={(e) => setDealSide(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-indigo-400 font-bold outline-none cursor-pointer">
                <option value="Seller">Listing Agreement (Seller Side)</option>
                <option value="Buyer">Purchase Agency (Buyer Side)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Active Milestone Lifecycle Phase</label>
              <select value={currentStage} onChange={(e) => setCurrentStage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-blue-400 font-bold outline-none cursor-pointer">
                {stages.map((stg, idx) => <option key={idx} value={stg}>{stg}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Contract Sales Volume Price ($)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Brokerage Fee Percentage (%)</label>
              <input type="number" step="0.1" value={commRate} onChange={(e) => setCommRate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-400 font-black outline-none" />
            </div>
            
            {/* Structural Contingency Risk Toggles */}
            <div className="lg:col-span-2 grid grid-cols-3 gap-2 items-end">
              <div className="pb-2">
                <label className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px] text-slate-400 cursor-pointer select-none">
                  <input type="checkbox" checked={isAtRisk} onChange={(e) => setIsAtRisk(e.target.checked)} className="accent-red-500 h-4 w-4 rounded border-slate-800" /> Escalated Risk
                </label>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Contract Friction Explanation</label>
                <input type="text" disabled={!isAtRisk} value={riskExplanation} onChange={(e) => setRiskExplanation(e.target.value)} placeholder="Detail appraisal/slow lender elements..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 disabled:opacity-40 outline-none" />
              </div>
            </div>
          </form>

          <div className="mt-4 bg-slate-950 p-3 rounded-xl border border-slate-800/60 flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-400">Calculated Gross Commission Income (GCI) Revenue Yield:</span>
            <span className="text-emerald-400 font-black text-sm">${parseInt(grossRevenueYield || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* SECTION 2: THE DATA INPUT & REGISTRY BLOCK MODULE GRIDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: DOCUMENT VAULT & PER-STAGE MILESTONE CHECKLISTS */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Document Locker Bind Intake */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-xs font-black uppercase text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5"><FileSignature size={14} className="text-blue-500" /> Bind Transactional Contract Documents</h2>
              <form onSubmit={handleAddDocumentAttachment} className="space-y-3 text-xs font-semibold">
                <input name="doc_name" required placeholder="Document Title (e.g., Executed PAR Agreement, Title Abstract)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <input name="doc_url" type="url" required placeholder="Secure Cloud Sharing URL (Google Drive, Dotloop, DocuSign)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono outline-none" />
                <select name="doc_stage" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-blue-400 font-bold outline-none">
                  {stages.map((stg, idx) => <option key={idx} value={stg}>{stg}</option>)}
                </select>
                <button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-3 rounded-xl transition tracking-wider text-[11px]">Bind File Attachment Link</button>
              </form>
            </div>

            {/* Document Ledger Viewer */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Verified Document Storage Vault</h3>
              {dataset.documents.length === 0 ? (
                <div className="text-slate-600 font-bold text-[10px] uppercase py-4">No legal folders or documentation linked to this transaction file.</div>
              ) : (
                <div className="space-y-2">
                  {dataset.documents.map(d => (
                    <div key={d.id} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center gap-1.5">{d.file_name} <a href={d.file_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition"><ExternalLink size={12}/></a></div>
                        <span className="text-[9px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{d.stage}</span>
                      </div>
                      <button onClick={() => handleDeleteRelationalItem('delete_document', 'doc_id', d.id)} className="text-slate-700 hover:text-red-400 p-1.5 transition"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: CHRONOLOGICAL CORRESPONDENCE JOURNALS & TASKS CHECKLIST */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Task Checklist Generation Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-xs font-black uppercase text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5"><ClipboardList size={14} className="text-blue-500" /> Create Contingency Task Requirements</h2>
              <form onSubmit={handleAddStageTask} className="space-y-3 text-xs font-semibold">
                <input name="task_title" required placeholder="Escrow Action Target (e.g., Collect Escrow Deposit, Schedule Walkthrough)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <select name="task_stage" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-blue-400 font-bold outline-none">
                  {stages.map((stg, idx) => <option key={idx} value={stg}>{stg}</option>)}
                </select>
                <button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-3 rounded-xl transition tracking-wider text-[11px]">Append Milestone Requirement</button>
              </form>
            </div>

            {/* Render Task Elements */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Transaction Milestone Checklist</h3>
              {dataset.tasks.length === 0 ? (
                <div className="text-slate-600 font-bold text-[10px] uppercase py-4">No operational task parameters assigned to this contract mapping yet.</div>
              ) : (
                <div className="space-y-2">
                  {dataset.tasks.map(t => (
                    <div key={t.id} className={`p-3 rounded-xl border flex items-start gap-3 transition ${t.is_complete ? 'bg-slate-950/40 border-slate-900 opacity-50' : 'bg-slate-950 border-slate-800'}`}>
                      <button onClick={() => toggleTaskCompleteState(t.id, t.is_complete)} className="mt-0.5 text-blue-400 shrink-0">
                        {t.is_complete ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Square size={16} />}
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

            {/* CHRONOLOGICAL JOURNAL PACKETS (Supports public logs and isolated admin panel files) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-xs font-black uppercase text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5"><Mail size={14} className="text-blue-500" /> Chronological Escrow Correspondence Journal</h2>
              <form onSubmit={handleAddJournalNote} className="space-y-3 text-xs font-semibold">
                <textarea name="content" required rows="3" placeholder="Paste tracking email summaries, lender conversation notes, or file friction matrices chronologically..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 font-medium leading-relaxed outline-none focus:border-slate-700" />
                
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 flex items-center gap-1">Visibility Channel Parameter:</span>
                  <select name="is_private" className="bg-slate-900 border border-slate-800 rounded p-1 font-bold text-xs text-slate-300 cursor-pointer outline-none">
                    <option value="false">👁️ Shared Public (Visible on Client Tracker)</option>
                    <option value="true">🔒 Internal Admin Only (Exclusively Private Log)</option>
                  </select>
                </div>

                <button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-2.5 rounded-xl transition tracking-wider text-[11px]">Log Historical File Entry</button>
              </form>

              {/* Journal Record Rendering Feed */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pt-2">
                {dataset.notes.map(n => (
                  <div key={n.id} className={`p-4 rounded-xl border text-xs relative group space-y-2 ${n.is_private ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-950 border-slate-800/80'}`}>
                    <div className="flex justify-between items-center border-b border-slate-800/40 pb-1.5 text-[9px] font-black uppercase tracking-wider text-slate-500">
                      <span className="flex items-center gap-1">Logged By: {n.author} · {new Date(n.created_at).toLocaleDateString()}</span>
                      <span className={`flex items-center gap-1 ${n.is_private ? 'text-red-400' : 'text-blue-400'}`}>
                        {n.is_private ? <><EyeOff size={11}/> Admin Private Notebook</> : <><Eye size={11}/> Client Shared Portal</>}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">{n.content}</p>
                    <div className="text-right">
                      <button onClick={() => handleDeleteRelationalItem('delete_note', 'note_id', n.id)} className="text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition duration-150"><Trash2 size={13}/></button>
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