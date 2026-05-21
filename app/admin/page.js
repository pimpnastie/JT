"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Database, User, Activity, AlertCircle, Sparkles, CheckCircle2, ShieldAlert, Mail, Phone, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState({ leads: [], deals: [] });
  const [loading, setLoading] = useState(true);

  // Queries the multi-table Postgres pipeline on launch
  const fetchClusterData = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const payload = await res.json();
        setData(payload);
      }
    } catch (err) {
      console.error("Pipeline compilation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchClusterData(); 
  }, []);

  // Corrected to find the element name arrays explicitly
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
        e.target.reset(); 
        fetchClusterData(); 
      }
    } catch (err) {
      console.error("Failed to execute transaction push:", err);
    }
  };

  // Direct asynchronous structural cell modifier
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
      console.error("Failed to write inline modifications:", err);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Navigation Control Banner */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <Database className="text-blue-500" /> Executive Platform Control
            </h1>
            <p className="text-xs text-slate-400">Manage pipeline security parameters and live client status desks</p>
          </div>
          <Link href="/" className="text-xs font-bold bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-400 hover:text-white transition">
            ← Exit View
          </Link>
        </div>

        {/* Provision Tracker Input Suite */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
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
              className="bg-slate-950 border border-slate-800 rounded-xl p-3Safe outline-none focus:border-blue-500 text-white" 
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
              className="bg-slate-950 border border-slate-800 rounded-xl p-3Safe outline-none focus:border-blue-500 text-blue-400 font-bold"
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

        {/* Live Active Transaction Table with row controls */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Activity size={16}/> Live Operational Desks
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
            {data.deals && data.deals.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                No operational files active in cluster cache memory.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b border-slate-800">
                    <th className="p-4">Target Account / Address</th>
                    <th className="p-4">Active Milestone Parameter</th>
                    <th className="p-4">Risk Shield Controller</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {data.deals && data.deals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-slate-950/20 transition">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{deal.client_name}</div>
                        <div className="text-slate-500 font-medium mt-0.5">{deal.property_address}</div>
                      </td>
                      <td className="p-4">
                        <select 
                          defaultValue={deal.current_stage}
                          onChange={(e) => handleUpdateDeal(deal.id, e.target.value, deal.is_at_risk, deal.risk_explanation)}
                          className="bg-slate-950 border border-slate-800 rounded-lg p-2 font-semibold text-blue-400 outline-none cursor-pointer"
                        >
                          <option>Mutual Acceptance</option>
                          <option>Home Inspection Period</option>
                          <option>Bank Appraisal Flight</option>
                          <option>Title Clear Search</option>
                          <option>Clear to Close 🎉</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <button 
                            type="button"
                            onClick={() => handleUpdateDeal(deal.id, deal.current_stage, !deal.is_at_risk, deal.risk_explanation)}
                            className={`px-3 py-1.5 rounded-lg font-black uppercase text-[10px] tracking-wider border transition-all duration-150 whitespace-nowrap ${deal.is_at_risk ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-md shadow-red-500/5' : 'bg-slate-950 border-slate-800/80 text-slate-500'}`}
                          >
                            {deal.is_at_risk ? "⚠️ Escalation Active" : "✓ Shield Normative"}
                          </button>
                          <input 
                            placeholder="Detail unreasonable criteria or bad agent friction..." 
                            defaultValue={deal.risk_explanation || ''} 
                            onBlur={(e) => handleUpdateDeal(deal.id, deal.current_stage, deal.is_at_risk, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 outline-none text-xs w-full max-w-xs focus:border-slate-700"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Regular Leads Pipeline Layer */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <User size={16}/> Communication Pipeline Streams
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 divide-y divide-slate-800/40">
            {data.leads && data.leads.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                No lead intake packets tracked inside cloud storage metrics yet.
              </div>
            ) : (
              data.leads && data.leads.map((l) => (
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
