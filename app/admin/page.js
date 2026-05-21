"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Database, User, Activity, Sparkles, MessageSquare, Briefcase, ExternalLink, Settings2, Lock, Users, UserPlus, FileText, Share2, BriefcaseIcon } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(''); // Tracks active identity
  const [viewTab, setViewTab] = useState('mine'); // 'mine' or 'team'
  
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [data, setData] = useState({ leads: [], deals: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionToken = localStorage.getItem('admin_session_active');
    const savedAgentName = localStorage.getItem('active_agent_identity');
    if (sessionToken === 'true' && savedAgentName) {
      setIsAuthenticated(true);
      setCurrentUser(savedAgentName);
      fetchClusterData();
    }
    setCheckingAuth(false);
  }, []);

  const fetchClusterData = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const payload = await res.json();
        setData({ leads: payload.leads || [], deals: payload.deals || [] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const token = passInput.trim().toLowerCase();
    
    if (token === "jeremyadmin2026") {
      localStorage.setItem('admin_session_active', 'true');
      localStorage.setItem('active_agent_identity', 'Jeremy Thieroff');
      setCurrentUser('Jeremy Thieroff');
      setIsAuthenticated(true);
      fetchClusterData();
    } else if (token === "partneradmin2026") {
      localStorage.setItem('admin_session_active', 'true');
      localStorage.setItem('active_agent_identity', 'Team Partner');
      setCurrentUser('Team Partner');
      setIsAuthenticated(true);
      fetchClusterData();
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session_active');
    localStorage.removeItem('active_agent_identity');
    setIsAuthenticated(false);
  };

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    const payload = {
      action: 'create_deal',
      client_name: e.target.elements.client.value,
      property_address: e.target.elements.address.value,
      current_stage: e.target.elements.stage.value,
      deal_side: e.target.elements.deal_side.value,
      price_parameter: parseFloat(e.target.elements.price.value) || 0,
      commission_rate: parseFloat(e.target.elements.comm.value) || 2.5,
      assigned_agent: currentUser // Locks to creator automatically
    };

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) { e.target.reset(); fetchClusterData(); }
  };

  const handleConvertLead = async (leadId) => {
    const propertyTarget = prompt("Enter Property Criteria or Target Address:");
    if (!propertyTarget) return;

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'convert_lead',
        lead_id: leadId,
        property_address: propertyTarget,
        deal_side: 'Buyer',
        assigned_agent: currentUser
      })
    });
    if (res.ok) fetchClusterData();
  };

  const handleReassign = async (dealId, targetAgentName) => {
    const res = await fetch('/api/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reassign_agent',
        id: dealId,
        assigned_agent: targetAgentName
      })
    });
    if (res.ok) fetchClusterData();
  };

  const handleUpdateDeal = async (id, stage, risk, explanation, side, price, comm, agent) => {
    await fetch('/api/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id, current_stage: stage, is_at_risk: risk, risk_explanation: explanation,
        deal_side: side, price_parameter: price, commission_rate: comm, assigned_agent: agent
      })
    });
    fetchClusterData();
  };

  if (checkingAuth) return <div className="bg-slate-950 min-h-screen flex items-center justify-center text-xs text-slate-500 tracking-widest font-bold uppercase animate-pulse">Running Session Authentication Loop...</div>;

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center font-sans px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl text-center relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="flex justify-center text-blue-500"><Lock size={40} /></div>
          <h2 className="text-lg font-black uppercase text-white tracking-tight">Security Gateway Challenge</h2>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input type="password" required placeholder="••••••••••••" value={passInput} onChange={(e) => setPassInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-center tracking-widest text-white outline-none focus:border-blue-600" />
            {authError && <p className="text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 py-2 rounded-xl">Access Denied.</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg">Validate Passkey</button>
          </form>
        </div>
      </div>
    );
  }

  // Frontend Matrix Filtering based on Tab views
  const filteredDeals = viewTab === 'mine' 
    ? data.deals.filter(d => d.assigned_agent === currentUser)
    : data.deals.filter(d => d.assigned_agent !== currentUser);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Headers */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2"><Database className="text-blue-500" /> Multi-Agent CRM Portal</h1>
            <p className="text-xs text-slate-400">Signed identity: <span className="text-blue-400 font-bold">{currentUser}</span> · Shared operational workspace</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl hover:text-white transition">Switch User</button>
            <Link href="/" className="text-xs font-bold bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-400 hover:text-white transition">← Exit View</Link>
          </div>
        </div>

        {/* Form Creation block */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-black uppercase text-blue-400 flex items-center gap-2"><Sparkles size={16}/> Provision New Client Workspace</h2>
          <form onSubmit={handleCreateDeal} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
            <input id="client" name="client" required placeholder="Client Name" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
            <input id="address" name="address" required placeholder="Property Address" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
            <select id="stage" name="stage" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-blue-400 font-bold outline-none">
              <option>Mutual Acceptance</option>
              <option>Home Inspection Period</option>
              <option>Bank Appraisal Flight</option>
              <option>Title Clear Search</option>
              <option>Clear to Close 🎉</option>
            </select>
            <select id="deal_side" name="deal_side" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-indigo-400 font-bold outline-none">
              <option>Seller (Listing)</option>
              <option>Buyer (Purchasing)</option>
            </select>
            <div className="flex gap-2">
              <input id="price" name="price" type="number" placeholder="Price ($)" className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
              <input id="comm" name="comm" type="number" step="0.1" placeholder="Comm %" defaultValue="2.5" className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
            </div>
            <button type="submit" className="lg:col-span-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-3 rounded-xl transition">Launch Active Transaction Matrix</button>
          </form>
        </div>

        {/* View Selection Layout Filter Tabs */}
        <div className="flex border-b border-slate-900 gap-2">
          <button onClick={() => setViewTab('mine')} className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${viewTab === 'mine' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}><Briefcase size={14}/> My Active Workspace ({data.deals.filter(d => d.assigned_agent === currentUser).length})</button>
          <button onClick={() => setViewTab('team')} className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${viewTab === 'team' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}><Users size={14}/> Team Funnel Stream ({data.deals.filter(d => d.assigned_agent !== currentUser).length})</button>
        </div>

        {/* Render Transaction Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto shadow-2xl">
          {filteredDeals.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-bold uppercase tracking-widest text-[11px]">No transaction trackers active inside this filtered buffer scope.</div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b border-slate-800">
                  <th className="p-4 rounded-l-xl">Account Identity</th>
                  <th className="p-4">Parameters</th>
                  <th className="p-4">Milestone</th>
                  <th className="p-4">Friction Shield</th>
                  <th className="p-4">Owner Assignment (Transfer Link)</th>
                  <th className="p-4 text-center rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-950/20 transition">
                    <td className="p-4">
                      <div className="font-black text-white text-sm">{deal.client_name}</div>
                      <div className="text-slate-400 font-medium mt-0.5">{deal.property_address}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-300 space-y-1">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wide border ${deal.deal_side?.startsWith('Seller') ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-sky-500/10 border-sky-500/20 text-sky-400'}`}>{deal.deal_side || 'Seller'}</span>
                      <div className="text-[11px] font-mono text-slate-400">${parseInt(deal.price_parameter || 0).toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <select defaultValue={deal.current_stage} onChange={(e) => handleUpdateDeal(deal.id, e.target.value, deal.is_at_risk, deal.risk_explanation, deal.deal_side, deal.price_parameter, deal.commission_rate, deal.assigned_agent)} className="bg-slate-950 border border-slate-800 rounded-lg p-2 font-bold text-blue-400 outline-none">
                        <option>Mutual Acceptance</option>
                        <option>Home Inspection Period</option>
                        <option>Bank Appraisal Flight</option>
                        <option>Title Clear Search</option>
                        <option>Clear to Close 🎉</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 items-center">
                        <button type="button" onClick={() => handleUpdateDeal(deal.id, deal.current_stage, !deal.is_at_risk, deal.risk_explanation, deal.deal_side, deal.price_parameter, deal.commission_rate, deal.assigned_agent)} className={`px-2 py-1.5 rounded-lg font-black uppercase text-[10px] tracking-wider border transition ${deal.is_at_risk ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-950 border-slate-800/80 text-slate-500'}`}>{deal.is_at_risk ? "⚠️ Escalation" : "✓ Safe"}</button>
                      </div>
                    </td>
                    {/* Programmatic Hand-off control parameter */}
                    <td className="p-4">
                      <select 
                        value={deal.assigned_agent} 
                        onChange={(e) => handleReassign(deal.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800/80 text-indigo-300 font-bold text-xs p-2 rounded-xl outline-none cursor-pointer focus:border-indigo-600"
                      >
                        <option value="Jeremy Thieroff">Jeremy Thieroff</option>
                        <option value="Team Partner">Team Partner</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <a href={`/tracker/${deal.id}`} target="_blank" rel="noreferrer" className="bg-slate-950 hover:bg-slate-900 border border-slate-800 px-2.5 py-2 rounded-xl text-blue-400 text-[10px] font-black uppercase tracking-wider transition"><ExternalLink size={12} /> View</a>
                        <Link href={`/tracker/${deal.id}/edit`} className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 px-2.5 py-2 rounded-xl text-amber-500 text-[10px] font-black uppercase tracking-wider transition"><Settings2 size={12} /> Process</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Global Pipeline Qualification Intake Stream Feed */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2"><UserCheck size={14} className="text-emerald-500" /> Universal Incoming Leads Inbox</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 divide-y divide-slate-800/40 shadow-2xl">
            {data.leads.length === 0 ? (
              <div className="text-center py-8 text-slate-500 font-bold uppercase tracking-widest text-[11px]">All incoming communication files processed.</div>
            ) : (
              data.leads.map((l) => (
                <div key={l.id} className="p-4 hover:bg-slate-950/30 rounded-xl transition flex justify-between items-start text-xs">
                  <div className="space-y-2 w-full max-w-4xl">
                    <span className="inline-block text-[9px] font-black tracking-widest uppercase px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded">{l.category}</span>
                    <div className="text-sm font-bold text-white">{l.name} · <span className="text-slate-400 text-xs font-normal">{l.email} | {l.phone}</span></div>
                    <div className="text-slate-400 font-medium bg-slate-950/40 p-3 rounded-lg border border-slate-800/30">{l.message}</div>
                  </div>
                  <button onClick={() => handleConvertLead(l.id)} className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-xl font-black uppercase text-[10px] tracking-wider transition whitespace-nowrap mt-4">Claim & Convert Client →</button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
import { UserCheck } from 'lucide-react';