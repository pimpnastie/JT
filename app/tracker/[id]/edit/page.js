"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Save, FileText, CheckSquare, Square, Mail, Plus, ArrowLeft, ClipboardList, Trash2, ExternalLink, DollarSign, Percent, User, Building, Calendar, ShieldAlert } from 'lucide-react';

export default function TrackerEditor() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dataset, setDataset] = useState({ deal: {}, notes: [], tasks: [], documents: [] });

  // Core CRM field states for the inline editing panel
  const [price, setPrice] = useState(0);
  const [commRate, setCommRate] = useState(2.5);
  const [dealSide, setDealSide] = useState('Seller');
  const [targetAddress, setTargetAddress] = useState('');

  const fetchFullFileDetails = async () => {
    const res = await fetch(`/api/deals/${id}`);
    if (res.ok) {
      const payload = await res.json();
      if (payload && payload.deal) {
        setDataset(payload);
        setPrice(payload.deal.price_parameter || 0);
        setCommRate(payload.deal.commission_rate || 2.5);
        setDealSide(payload.deal.deal_side || 'Seller');
        setTargetAddress(payload.deal.property_address || '');
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchFullFileDetails(); }, [id]);

  // Handles updating the comprehensive CRM parameters card
  const handleSaveCrmMetadata = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          current_stage: dataset.deal.current_stage,
          is_at_risk: dataset.deal.is_at_risk,
          risk_explanation: dataset.deal.risk_explanation,
          deal_side: dealSide,
          price_parameter: parseFloat(price) || 0,
          commission_rate: parseFloat(commRate) || 0,
          property_address: targetAddress
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchFullFileDetails();
      }
    } catch (err) {
      console.error("Failed to update transactional CRM record:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const content = e.target.content.value;
    const res = await fetch(`/api/deals/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_note', content, is_private: false, author: dataset.deal?.assigned_agent || 'Admin' })
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

  if (loading) return <div className="bg-slate-950 min-h-screen flex items-center justify-center text-xs text-slate-500 tracking-widest uppercase font-bold animate-pulse">Loading Transaction Parameters...</div>;

  const currentStageFallback = dataset.deal?.current_stage || 'Mutual Acceptance';
  const grossCommissionEarnings = (price * (commRate / 100));

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Control Header */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <div className="space-y-1">
            <Link href="/admin" className="text-slate-500 hover:text-white text-xs font-bold flex items-center gap-1 transition">
              <ArrowLeft size={12}/> Back to Executive Dashboard
            </Link>
            <h1 className="text-xl font-black uppercase text-white tracking-tight mt-1">Transaction Workspace Editor</h1>
            <p className="text-xs text-slate-400 font-medium">Assigned Representative: <span className="text-blue-400 font-bold">{dataset.deal?.assigned_agent || "Unassigned"}</span></p>
          </div>
          <Link href={`/tracker/${id}`} target="_blank" className="text-xs font-black bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition uppercase tracking-wider shadow-md flex items-center gap-1.5">
            Open Public Client Portal <ExternalLink size={14}/>
          </Link>
        </div>

        {/* 🛠️ CRM PARAMETERS CARD (Financials, Deal Sides, Rates) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500" />
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-800 pb-4 mb-6 gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Building size={16} className="text-blue-500"/> Core Escrow File Financial Summary
              </h2>
              <p className="text-xs text-slate-400">Modify dynamic value parameters. Updates instantly change computed revenue forecast formulas.</p>
            </div>
            
            {/* Guidance Save Actions */}
            <div className="flex items-center gap-3 self-end lg:self-auto">
              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl animate-fade-in">
                  ✓ Ledger Record Saved Successfully
                </span>
              )}
              <button 
                onClick={handleSaveCrmMetadata} 
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
              >
                <Save size={14}/> Save CRM Changes
              </button>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1"><User size={12}/> Client Profile Name</label>
              <input 
                type="text" 
                disabled
                value={dataset.deal?.client_name || ''} 
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-slate-400 outline-none cursor-not-allowed font-medium" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1"><Building size={12}/> Contract/Property Address</label>
              <input 
                type="text" 
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium outline-none focus:border-blue-500" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Transaction Classification (Side)</label>
              <select 
                value={dealSide} 
                onChange={(e) => setDealSide(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-indigo-400 font-bold outline-none cursor-pointer focus:border-blue-500"
              >
                <option value="Seller">Listing Agent (Seller Representation)</option>
                <option value="Buyer">Selling Agent (Buyer Representation)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-0.5"><DollarSign size={12}/> Contract/Listing Price ($)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pl-7 text-white font-bold outline-none focus:border-blue-500" 
                />
                <span className="absolute left-3 top-3.5 text-slate-600 font-bold">$</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-0.5"><Percent size={11}/> Commission Brokerage Fee (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={commRate}
                onChange={(e) => setCommRate(e.target.value)}
                placeholder="2.5"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-400 font-black outline-none focus:border-blue-500" 
              />
            </div>
          </form>

          {/* Computed Gross Revenue Ledger Flag */}
          <div className="mt-5 bg-slate-950 p-4 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Estimated Gross Commission Income (GCI) Yield Forecast:</span>
            <span className="text-emerald-400 font-black text-sm tracking-tight flex items-center"><DollarSign size={14}/>{parseInt(grossCommissionEarnings || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Documents Locker Section */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-black uppercase text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-blue-500" /> Bind Transactional Contract Documents
              </h2>
              <form onSubmit={handleAddDocument} className="space-y-3 text-xs">
                <input name="doc_name" required placeholder="Document Title (e.g., Executed Sales Agreement, Home Inspection Report)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-slate-700 text-white font-medium" />
                <input name="doc_url" type="url" required placeholder="Secure Cloud Document URL Link (Google Drive, Dotloop, DocuSign)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-slate-700 text-white font-mono" />
                
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Associate Document with Transaction Milestone Phase:</label>
                  <select name="doc_stage" defaultValue={currentStageFallback} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-blue-400 font-bold outline-none">
                    <option>Mutual Acceptance</option>
                    <option>Home Inspection Period</option>
                    <option>Bank Appraisal Flight</option>
                    <option>Title Clear Search</option>
                    <option>Clear to Close 🎉</option>
                  </select>
                </div>
                
                <button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-3 rounded-xl transition text-[11px] tracking-wider shadow-md">
                  Secure Document File Reference
                </button>
              </form>
            </div>

            {/* Render Documents Linked */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Verified Document Storage Vault</h3>
              {dataset.documents.length === 0 ? (
                <div className="text-slate-600 font-bold text-[10px] uppercase py-4">No legal document assets tied to this transaction portfolio yet.</div>
              ) : (
                <div className="space-y-2">
                  {dataset.documents.map(d => (
                    <div key={d.id} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {d.file_name} 
                          <a href={d.file_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition" title="Open Cloud File Link">
                            <ExternalLink size={12}/>
                          </a>
                        </div>
                        <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{d.stage}</span>
                      </div>
                      <button onClick={() => handleDeleteItem('delete_document', 'doc_id', d.id)} className="text-slate-600 hover:text-red-400 p-1.5 transition" title="Delete File Link"><Trash2 size={14}/></button>
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
              <h2 className="text-xs font-black uppercase text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <ClipboardList size={14} className="text-blue-500" /> Create Contingency & Milestone Task Requirements
              </h2>
              <form onSubmit={handleAddTask} className="space-y-3 text-xs">
                <input name="task_title" required placeholder="Escrow Action Step (e.g., Collect Earnest Money, Order Title Abstracts)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-slate-700 text-white font-medium" />
                
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Map Task Target Deadline Window:</label>
                  <select name="task_stage" defaultValue={currentStageFallback} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-blue-400 font-bold outline-none">
                    <option>Mutual Acceptance</option>
                    <option>Home Inspection Period</option>
                    <option>Bank Appraisal Flight</option>
                    <option>Title Clear Search</option>
                    <option>Clear to Close 🎉</option>
                  </select>
                </div>

                <button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-3 rounded-xl transition text-[11px] tracking-wider shadow-md">
                  Append Escrow Task Item
                </button>
              </form>
            </div>

            {/* Task Checklist Tracker */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Transaction Milestone Checklist</h3>
              {dataset.tasks.length === 0 ? (
                <div className="text-slate-600 font-bold text-[10px] uppercase py-4">No task parameters or contingency checks configured for this file.</div>
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
              <h2 className="text-xs font-black uppercase text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <Mail size={14} className="text-blue-500" /> Internal Chronological Transaction Journal
              </h2>
              <form onSubmit={handleAddNote} className="space-y-3 text-xs">
                <textarea name="content" required rows="3" placeholder="Log telephone interaction details, lender responses, or escrow friction notes chronologically..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-slate-700 text-slate-300 leading-relaxed font-medium" />
                <button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-2.5 rounded-xl transition text-[11px] tracking-wider shadow-md">
                  Log Historical File Entry
                </button>
              </form>

              <div className="space-y-3 max-h-[220px] overflow-y-auto pt-2">
                {dataset.notes.map(n => (
                  <div key={n.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 text-xs relative group">
                    <p className="text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">{n.content}</p>
                    <div className="mt-2 flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      <span>Recorded By: {n.author} · {new Date(n.created_at).toLocaleDateString()}</span>
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