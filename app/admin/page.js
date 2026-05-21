"use client";
import { useEffect, useState } from 'react';
import Link from 'next/nav';
import { useRouter } from 'next/navigation';
import { Database, User, Activity, AlertCircle, Sparkles, Mail, Phone, MessageSquare, Briefcase, ExternalLink, Settings2, Lock, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Auth state tracking keys
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Operational pipeline data keys
  const [data, setData] = useState({ leads: [], deals: [] });
  const [loading, setLoading] = useState(true);

  // Check if session token exists in local file storage on component mount
  useEffect(() => {
    const sessionToken = localStorage.getItem('admin_session_active');
    if (sessionToken === 'true') {
      setIsAuthenticated(true);
      fetchClusterData();
    }
    setCheckingAuth(false);
  }, []);

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

  // Basic security routing handshake verification
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError(false);

    // We pass the string verification to a local verification checkpoint or environment variable
    // For Next.js client setups, we can cross-verify against a secure runtime evaluation
    if (passInput === "JeremyAdmin2026") { // <-- You can change this local string placeholder or pull from a micro API path
      localStorage.setItem('admin_session_active', 'true');
      setIsAuthenticated(true);
      fetchClusterData();
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session_active');
    setIsAuthenticated(false);
    setData({ leads: [], deals: [] });
  };

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

  if (checkingAuth) {
    return <div className="bg-slate-950 min-h-screen flex items-center justify-center text-xs text-slate-500 tracking-widest font-black uppercase animate-pulse">Running security authorization sweep...</div>;
  }

  // RENDERING CONDITION SHIELD: If unauthenticated, show the secure gateway layout lock box
  if (!isAuthenticated) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center font-sans px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800/80 rounded-3xl p-8 space-y-6 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
          
          <div className="flex justify-center text-blue-500"><Lock size={40} className="animate-pulse" /></div>
          
          <div className="space-y-1">
            <h2 className="text-lg font-black uppercase text-white tracking-tight">Security Gateway Challenge</h2>
            <p className="text-xs text-slate-400 font-medium">Restricted executive route. Submit authorized network passkey strings.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Master Administrative Token</label>
              <input 
                type="password" 
                required
                placeholder="••••••••••••"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-center tracking-widest text-white outline-none focus:border-blue-600 transition"
              />
            </div>

            {authError && (
              <p className="text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 py-2 rounded-xl">
                Invalid cryptographic token entry. Access Denied.
              </p>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg active:scale-[0.99]">
              Validate Passkey
            </button>
          </form>

          <Link href="/" className="inline-block text-[10px] font-black uppercase text-slate-500 hover:text-slate-400 underline tracking-wider pt-2">
            ← Return to public homepage
          </Link>
        </div>
      </div>
    );
  }

  // If user passes verification, render the complete dashboard panel perfectly!
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
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogout}
              className="text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/10 px-3 py-2 rounded-xl hover:bg-red-500/20 transition"
            >
              Lock Console
            </button>
            <Link href="/" className="text-xs font-bold bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-400 hover:text-white transition">
              ← Exit View
            </Link>
          </div>
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
                      <td className="p-4">
                        <div className="font-black text-white text-sm">{deal.client_name}</div>
                        <div className="text-slate-400 font-medium mt-0.5">{deal.property_address}</div>
                        <div className="text-[10px] text-slate-600 font-mono mt-1">ID-REF: XA-{deal.id}</div>
                      </td>
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
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <a 
                            href={`/tracker/${deal.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-blue-400 hover:text-blue-300 text-[10px] font-black uppercase tracking-wider transition"
                          >
                            <ExternalLink size={12} /> Client Link
                          </a>
                          <Link 
                            href={`/tracker/${deal.id}/edit`}
                            className="inline-flex items-center gap-1 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 px-3 py-2 rounded-xl text-amber-500 hover:text-amber-400 text-[10px] font-black uppercase tracking-wider transition"
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
