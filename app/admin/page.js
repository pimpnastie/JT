"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Database, User, Activity, AlertCircle, Sparkles, Mail, Phone, MessageSquare, Briefcase, ExternalLink, Settings2 } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState({ leads: [], deals: [] });
  const [loading, setLoading] = useState(true);

  // Queries your database cluster metrics safely
  const fetchClusterData = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const payload = await res.json();
        setData({
          leads: payload.leads || [],
          deals: payload.deals || []
        });
      }
    } catch (err) {
      console.error("Pipeline data retrieval failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    let isCurrent = true;
    if (isCurrent) {
      fetchClusterData();
    }
    return () => { isCurrent = false; };
  }, []);

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    const payload = {
      action: 'create_deal',
      client_name: e.target.elements.client.value,
      property_address: e.target.elements.address.value,
      current_stage: e.target.elements.stage.value,
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) { 
        const resData = await res.json();
        e.target.reset(); 
        // Forwards you right into your editing workspace desk
        router.push(`/tracker/${resData.id}/edit`);
      }
    } catch (err) {
      console.error("Failed to execute transaction push:", err);
    }
  };

  const handleUpdateDeal = async (id, stage, risk, explanation) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          current_stage: stage, 
          is_at_risk: risk, 
          risk_explanation: explanation 
        })
      });
      if (res.ok) {
        fetchClusterData();
      }
    } catch (err) {
      console.error("Inline modification failure:", err);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Main Banner Bar */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <Database className="text-blue-500" /> Executive Platform Control
            </h1>
            <p className="text-xs text-slate-400">Monitor active buyer/seller profiles, documents, and messaging pipeline metrics</p>
          </div>
          <Link href="/" className="text-xs font-bold bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-400 hover:text-white transition">
            ← Exit View
          </Link>
        </div>

        {/* Create Tracker Form Block */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-black uppercase text-blue-400 flex items-center gap-2">
            <Sparkles size={16}/> Provision Active Transaction Tracker
          </h2>
          <form onSubmit={handleCreateDeal} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <input  
              id="client"
              name="client" 
              type="text"
              placeholder="Client Legal Name" 
              required 
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-blue-500 text-white" 
            />
            <input 
              id="address"
              name="address" 
              type="text"
              placeholder="Property Address" 
              required 
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-blue-500 text-white" 
            />
            <select 
              id="stage"
              name="stage" 
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-blue-500 text-blue-400 font-bold"
            >
              <option>Mutual Acceptance</option>
              <option>Home Inspection Period</option>
              <option>Bank Appraisal Flight</option>
              <option>Title Clear Search</option>
              <option>Clear to Close 🎉</option>
            </select>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider rounded-xl py-3 transition shadow-md active:scale-[0.99]"
            >
              Launch Tracker
            </button>
          </form>
        </div>

        {/* MASTER TRANSACTION MONITOR LISTING TABLE */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Briefcase size={16} className="text-blue-500" /> Active Client Transaction Lists
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto shadow-2xl">
            {loading ? (
              <div className="text-center py-8 text-slate-500 animate-pulse font-bold text-xs uppercase tracking-widest">Re-assembling pipeline blocks...</div>
            ) : data.deals.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                No operational tracking profiles logged inside cloud memory cells.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b border-slate-800">
                    <th className="p-4 rounded-l-xl">Account Information</th>
                    <th className="p-4">Current Lifecycle Step</th>
                    <th className="p-4">Risk Management Configuration</th>
                    <th className="p-4 text-center rounded-r-xl">Action Portals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {data.deals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-slate-950/20 transition group">
                      {/* Name and Metadata */}
                      <td className="p-4">
                        <div className="font-black text-white text-sm">{deal.client_name}</div>
                        <div className="text-slate-400 font-medium mt-0.5">{deal.property_address}</div>
                        <div className="text-[10px] text-slate-600 font-mono mt-1">ID-REF: XA-{deal.id}</div>
                      </td>
                      {/* Dynamic Stage Switcher */}
                      <td className="p-4">
                        <select 
                          defaultValue={deal.current_stage}
                          onChange={(e) => handleUpdateDeal(deal.id, e.target.value, deal.is_at_risk, deal.risk_explanation)}
                          className="bg-slate-950 border border-slate-800 rounded-lg p-2 font-bold text-blue-400 outline-none cursor-pointer focus:border-blue-600"
                        >
                          <option>Mutual Acceptance</option>
                          <option>Home Inspection Period</option>
                          <option>Bank Appraisal Flight</option>
                          <option>Title Clear Search</option>
                          <option>Clear to Close 🎉</option>
                        </select>
                      </td>
                      {/* Boundary Risk Toggles */}
                      <td className="p-4">
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                          <button 
                            type="button"
                            onClick={() => handleUpdateDeal(deal.id, deal.current_stage, !deal.is_at_risk, deal.risk_explanation)}
                            className={`px-3 py-1.5 rounded-lg font-black uppercase text-[10px] tracking-wider border transition-all duration-150 ${deal.is_at_risk ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-950 border-slate-800/80 text-slate-500 hover:text-slate-400'}`}
                          >
                            {deal.is_at_risk ? "⚠️ Active Friction" : "✓ Shield Normative"}
                          </button>
                          <input 
                            placeholder="Detail boundary issues or slow vendors..." 
                            defaultValue={deal.risk_explanation || ''} 
                            onBlur={(e) => handleUpdateDeal(deal.id, deal.current_stage, deal.is_at_risk, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 outline-none text-xs w-full max-w-[200px] focus:border-slate-700"
                          />
                        </div>
                      </td>
                      {/* Operational Portal Hyperlinks */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link 
                            href={`/tracker/${deal.id}`}
                            className="inline-flex items-center gap-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-blue-400 hover:text-blue-300 text-[10px] font-black uppercase tracking-wider transition"
                            title="Open Client Portal View"
                          >
                            <ExternalLink size={12} /> Client Link
                          </Link>
                          <Link 
                            href={`/tracker/${deal.id}/edit`}
                            className="inline-flex items-center gap-1 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 px-3 py-2 rounded-xl text-amber-500 hover:text-amber-400 text-[10px] font-black uppercase tracking-wider transition"
                            title="Manage Files, Tasks & Emails"
                          >
                            <Settings2 size={12} /> Process File
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Web Inbound Leads Stream Feed */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <User size={16}/> Communication Pipeline Streams
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 divide-y divide-slate-800/40 shadow-2xl">
            {data.leads.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                No intake packets tracked inside cloud storage metrics yet.
              </div>
            ) : (
              data.leads.map((l) => (
                <div key={l.id} className="p-4 hover:bg-slate-950/30 rounded-xl transition flex justify-between items-start text-xs border-slate-800/40">
                  <div className="space-y-2">
                    <span className={`inline-block text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded border ${l.category === 'Cooperating Agent Request' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                      {l.category}
                    </span>
                    <div className="text-sm font-bold text-white pt-1">
                      {l.name} · <span className="text-slate-400 text-xs font-normal">{l.email} | {l.phone}</span>
                    </div>
                    <div className="text-slate-400 leading-relaxed max-w-3xl font-medium flex items-start gap-1.5 bg-slate-950/40 p-3 rounded-lg border border-slate-800/30">
                      <MessageSquare size={14} className="text-slate-600 mt-0.5 shrink-0" />
                      {l.message}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}