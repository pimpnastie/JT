"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Database, User, Activity, Sparkles, MessageSquare, Briefcase, ExternalLink, 
  Settings2, Lock, Users, UserPlus, Save, DollarSign, Percent, BookOpen, 
  Receipt, ClipboardList, LogOut, CheckCircle2, ShieldAlert, FileSignature, 
  MapPin, Landmark, FileText, UserCheck, Eye
} from 'lucide-react';

export default function AdminDashboard() {
  // Authentication & Session Workspace Identity Keys
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('Jeremy Thieroff');
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Deep Real Estate Domain Navigation Cogs
  const [activeModule, setActiveModule] = useState('listings'); // 'listings', 'escrows', 'regulatory', 'ce_tracker', 'expenses', 'team'
  const [viewTab, setViewTab] = useState('mine'); // 'mine' vs 'team'

  // Central Database Pipeline Storage state
  const [data, setData] = useState({ leads: [], deals: [] });
  const [loading, setLoading] = useState(true);
  const [agentsList, setAgentsList] = useState(['Jeremy Thieroff', 'Team Partner']);

  // PA CE Tracker Performance Metrics (Biennial State Requirements Monitor)
  const [ceHours, setCeHours] = useState({ completed: 6, required: 14, deadLine: 'May 31, 2026' });
  const [ceCourses, setCeCourses] = useState([
    { id: 1, name: 'PA Real Estate Core Agency Law & Fiduciary Duty', hours: 3.5, date: '2025-11-12', category: 'Mandatory Core' },
    { id: 2, name: 'Implicit Bias & PA Fair Housing Mandate', hours: 2.5, date: '2026-02-18', category: 'Fair Housing' }
  ]);

  // Schedule-C Independent Contractor Expense Ledger
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'West Penn MLS Quarterly Access Dues', amount: 145.00, category: 'MLS & Association Fees', date: '2026-04-01' },
    { id: 2, description: 'ShowingTime Software Platform Subscription', amount: 45.00, category: 'Software & Technology', date: '2026-04-15' },
    { id: 3, description: 'Facebook Target Geofenced Ad Run - 3411 Mt Troy Open House', amount: 75.00, category: 'Marketing & Advertising', date: '2026-05-10' }
  ]);

  useEffect(() => {
    const sessionToken = localStorage.getItem('admin_session_active');
    const savedAgentName = localStorage.getItem('active_agent_identity');
    const savedAgents = localStorage.getItem('crm_registered_agents');
    
    if (sessionToken === 'true' && savedAgentName) {
      setIsAuthenticated(true);
      setCurrentUser(savedAgentName);
    }
    if (savedAgents) {
      setAgentsList(JSON.parse(savedAgents));
    }
    fetchClusterData();
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
      console.error("Data pipeline load fault:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const token = passInput.trim().toLowerCase();
    
    if (token === "jeremyadmin2026") {
      logUserIn('Jeremy Thieroff');
    } else if (token === "partneradmin2026") {
      logUserIn('Team Partner');
    } else if (token.endsWith('admin2026')) {
      const parsedAgentName = token.replace('admin2026', '').replace('_', ' ');
      const matched = agentsList.find(a => a.toLowerCase().replace(/\s+/g, '') === parsedAgentName);
      if (matched) logUserIn(matched);
      else setAuthError(true);
    } else {
      setAuthError(true);
    }
  };

  const logUserIn = (agentName) => {
    localStorage.setItem('admin_session_active', 'true');
    localStorage.setItem('active_agent_identity', agentName);
    setCurrentUser(agentName);
    setIsAuthenticated(true);
    fetchClusterData();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session_active');
    localStorage.removeItem('active_agent_identity');
    setIsAuthenticated(false);
  };

  const handleAddAgentToRegistry = (e) => {
    e.preventDefault();
    const newName = e.target.agent_name.value.trim();
    if (!newName || agentsList.includes(newName)) return;

    const updatedList = [...agentsList, newName];
    setAgentsList(updatedList);
    localStorage.setItem('crm_registered_agents', JSON.stringify(updatedList));
    alert(`Success: ${newName} added. Passkey generated: ${newName.toLowerCase().replace(/\s+/g, '_')}admin2026`);
    e.target.reset();
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
      assigned_agent: currentUser
    };

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) { e.target.reset(); fetchClusterData(); }
  };

  const handleConvertLead = async (leadId) => {
    const propertyTarget = prompt("Enter Target Property Escrow Location / CMA Criteria Notes:");
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

  const handleSaveRowData = async (dealId) => {
    const stage = document.getElementById(`stage-${dealId}`).value;
    const side = document.getElementById(`side-${dealId}`).value;
    const price = parseFloat(document.getElementById(`price-${dealId}`).value) || 0;
    const comm = parseFloat(document.getElementById(`comm-${dealId}`).value) || 0;
    const agent = document.getElementById(`agent-${dealId}`).value;
    const isRisk = document.getElementById(`risk-${dealId}`).checked;
    const explanation = document.getElementById(`explain-${dealId}`).value;

    const res = await fetch('/api/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: dealId, current_stage: stage, deal_side: side, price_parameter: price,
        commission_rate: comm, assigned_agent: agent, is_at_risk: isRisk, risk_explanation: explanation
      })
    });

    if (res.ok) {
      alert(`✓ PAR Escrow Ledger Synchronized for ID file: XA-${dealId}`);
      fetchClusterData();
    }
  };

  const handleAddCeCourse = (e) => {
    e.preventDefault();
    const newCourse = {
      id: Date.now(), name: e.target.c_name.value,
      hours: parseFloat(e.target.c_hours.value) || 0, date: e.target.c_date.value, category: e.target.c_cat.value
    };
    const updated = [newCourse, ...ceCourses];
    setCeCourses(updated);
    setCeHours({ ...ceHours, completed: updated.reduce((sum, c) => sum + c.hours, 0) });
    e.target.reset();
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    setExpenses([{
      id: Date.now(), description: e.target.e_desc.value, amount: parseFloat(e.target.e_amt.value) || 0,
      category: e.target.e_cat.value, date: e.target.e_date.value
    }, ...expenses]);
    e.target.reset();
  };

  if (checkingAuth) return <div className="bg-slate-950 min-h-screen flex items-center justify-center text-xs text-slate-500 font-bold uppercase animate-pulse">Running Compliance Handshake...</div>;

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center font-sans px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl text-center relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="flex justify-center text-blue-500"><Lock size={40} /></div>
          <h2 className="text-lg font-black uppercase text-white tracking-tight">Brokerage Security Gateway</h2>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input type="password" required placeholder="Enter Realtor Authentication Key" value={passInput} onChange={(e) => setPassInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-center tracking-widest text-white outline-none focus:border-blue-600" />
            {authError && <p className="text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 py-2 rounded-xl">Credentials Rejected.</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg">Authenticate Identity</button>
          </form>
        </div>
      </div>
    );
  }

  // Segmenting out data arrays safely for multi-agent partition tab metrics
  const sanitizedUser = currentUser.trim().toLowerCase();
  const personalDeals = data.deals.filter(d => (d.assigned_agent || '').trim().toLowerCase() === sanitizedUser);
  const teamDeals = data.deals.filter(d => (d.assigned_agent || '').trim().toLowerCase() !== sanitizedUser);
  const baseDealsDisplay = viewTab === 'mine' ? personalDeals : teamDeals;

  // Real estate categorization filtering logic
  const listingDeals = baseDealsDisplay.filter(d => d.deal_side === 'Seller');
  const escrowDeals = baseDealsDisplay.filter(d => d.deal_side === 'Buyer');

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col lg:flex-row">
      
      {/* 🧭 BROKERAGE COMMAND CENTER NAVIGATION SIDEBAR */}
      <div className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-6 space-y-8 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-black tracking-widest text-white flex items-center gap-2 uppercase"><Landmark className="text-blue-500" size={16} /> Brokerage Console</div>
            <p className="text-[11px] text-slate-500 font-bold">Designated Agent: <span className="text-blue-400 block">{currentUser}</span></p>
          </div>

          <nav className="flex flex-col gap-1 text-xs font-bold text-slate-400">
            <button onClick={() => setActiveModule('listings')} className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between ${activeModule === 'listings' ? 'bg-blue-600 text-white' : 'hover:bg-slate-950 hover:text-white'}`}>
              <span className="flex items-center gap-2"><Building2 size={16}/> Listing Portfolio (Sellers)</span>
              <span className="text-[10px] opacity-70">({data.deals.filter(d => d.deal_side === 'Seller').length})</span>
            </button>
            <button onClick={() => setActiveModule('escrows')} className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between ${activeModule === 'escrows' ? 'bg-blue-600 text-white' : 'hover:bg-slate-950 hover:text-white'}`}>
              <span className="flex items-center gap-2"><Briefcase size={16}/> Escrow Pipeline (Buyers)</span>
              <span className="text-[10px] opacity-70">({data.deals.filter(d => d.deal_side === 'Buyer').length})</span>
            </button>
            <button onClick={() => setActiveModule('regulatory')} className={`w-full text-left p-3 rounded-xl transition flex items-center gap-2 ${activeModule === 'regulatory' ? 'bg-blue-600 text-white' : 'hover:bg-slate-950 hover:text-white'}`}><FileSignature size={16}/> PA Regulatory Disclosure</button>
            <button onClick={() => setActiveModule('ce_tracker')} className={`w-full text-left p-3 rounded-xl transition flex items-center gap-2 ${activeModule === 'ce_tracker' ? 'bg-blue-600 text-white' : 'hover:bg-slate-950 hover:text-white'}`}><BookOpen size={16}/> Mandatory Continuing Ed</button>
            <button onClick={() => setActiveModule('expenses')} className={`w-full text-left p-3 rounded-xl transition flex items-center gap-2 ${activeModule === 'expenses' ? 'bg-blue-600 text-white' : 'hover:bg-slate-950 hover:text-white'}`}><Receipt size={16}/> Tax Deductions Ledger</button>
            <button onClick={() => setActiveModule('team')} className={`w-full text-left p-3 rounded-xl transition flex items-center gap-2 ${activeModule === 'team' ? 'bg-blue-600 text-white' : 'hover:bg-slate-950 hover:text-white'}`}><Users size={16}/> Office Team Directory</button>
          </nav>
        </div>

        <button onClick={handleLogout} className="w-full bg-slate-950 border border-slate-800/80 p-2.5 rounded-xl text-[10px] font-black uppercase text-red-400 hover:bg-red-500/10 transition flex items-center justify-center gap-1.5"><LogOut size={12}/> Terminate Session</button>
      </div>

      {/* MAIN DATA AGGREGATION VIEWPORT CONTAINER */}
      <div className="flex-1 p-8 space-y-6 overflow-x-hidden">
        
        {/* TOP LEVEL PROVISION FORM LAYER (Shared across core deal pipelines) */}
        {(activeModule === 'listings' || activeModule === 'escrows') && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <h2 className="text-xs font-black uppercase text-blue-400 flex items-center gap-1.5"><Sparkles size={14}/> Provision Exclusive Agency Representation File</h2>
            <form onSubmit={handleCreateDeal} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              <input id="client" name="client" required placeholder="Client Full Legal Name" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
              <input id="address" name="address" required placeholder="Property Target Address / Location" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
              <select id="stage" name="stage" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-blue-400 font-bold outline-none">
                <option>Mutual Acceptance</option>
                <option>Home Inspection Period</option>
                <option>Bank Appraisal Flight</option>
                <option>Title Clear Search</option>
                <option>Clear to Close 🎉</option>
              </select>
              <select id="deal_side" name="deal_side" defaultValue={activeModule === 'listings' ? 'Seller' : 'Buyer'} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-indigo-400 font-bold outline-none">
                <option value="Seller">Listing Representation (Seller Side)</option>
                <option value="Buyer">Purchasing Representation (Buyer Side)</option>
              </select>
              <div className="flex gap-2">
                <input id="price" name="price" type="number" placeholder="Price ($)" className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <input id="comm" name="comm" type="number" step="0.1" placeholder="Comm %" defaultValue="2.5" className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
              </div>
              <button type="submit" className="lg:col-span-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-3 rounded-xl transition text-[11px] tracking-wider">Execute Asset Provisioning Matrix</button>
            </form>
          </div>
        )}

        {/* 📋 WORKSPACE MODULE 1: SELLER LISTINGS PORTFOLIO */}
        {activeModule === 'listings' && (
          <div className="space-y-6">
            <div className="flex border-b border-slate-900 gap-2">
              <button onClick={() => setViewTab('mine')} className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition border-b-2 ${viewTab === 'mine' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500'}`}>My Listings ({listingDeals.length})</button>
              <button onClick={() => setViewTab('team')} className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition border-b-2 ${viewTab === 'team' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500'}`}>Brokerage Listings Team Inventory ({data.deals.filter(d => d.deal_side === 'Seller' && d.assigned_agent !== currentUser).length})</button>
            </div>
            {renderDealTable(listingDeals)}
          </div>
        )}

        {/* 💼 WORKSPACE MODULE 2: BUYER ESCROW PIPELINE */}
        {activeModule === 'escrows' && (
          <div className="space-y-6">
            <div className="flex border-b border-slate-900 gap-2">
              <button onClick={() => setViewTab('mine')} className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition border-b-2 ${viewTab === 'mine' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500'}`}>My Active Escrows ({escrowDeals.length})</button>
              <button onClick={() => setViewTab('team')} className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition border-b-2 ${viewTab === 'team' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500'}`}>Office Co-Brokerage Escrow Streams ({data.deals.filter(d => d.deal_side === 'Buyer' && d.assigned_agent !== currentUser).length})</button>
            </div>
            {renderDealTable(escrowDeals)}
          </div>
        )}

        {/* ⚖️ WORKSPACE MODULE 3: PA REGULATORY LEAD COMPLIANCE MATRIX */}
        {activeModule === 'regulatory' && (
          <div className="space-y-6">
            <div className="border-b border-slate-900 pb-3">
              <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2"><FileSignature className="text-blue-500"/> State Disclosure Regulation Queue</h2>
              <p className="text-xs text-slate-400">PA State Mandate Tracker: Every substantive interaction requires a Consumer Notice check-off prior to executing written representation agreements.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              {data.leads.length === 0 ? (
                <div className="text-center py-8 text-slate-600 font-black uppercase text-[11px]">Inbound communication streams fully authorized & audited.</div>
              ) : (
                <div className="divide-y divide-slate-800/40">
                  {data.leads.map((l) => (
                    <div key={l.id} className="p-4 hover:bg-slate-950/30 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition">
                      <div className="space-y-1.5 max-w-4xl">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-black tracking-wider uppercase">Fiduciary Check Pending</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Source Channel: {l.category}</span>
                        </div>
                        <div className="font-bold text-white text-sm">{l.name} · <span className="text-slate-400 text-xs font-normal">{l.email} | {l.phone}</span></div>
                        <p className="text-slate-400 bg-slate-950/40 border border-slate-800/40 p-3 rounded-lg text-xs leading-relaxed font-medium">{l.message}</p>
                      </div>
                      
                      <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto">
                        <button onClick={() => handleConvertLead(l.id)} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] px-3 py-2 rounded-xl tracking-wider transition flex items-center justify-center gap-1"><UserCheck size={12}/> Log Consumer Notice & Convert</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 📚 WORKSPACE MODULE 4: MANDATORY CONTINUING EDUCATION TRACKER */}
        {activeModule === 'ce_tracker' && (
          <div className="space-y-6 max-w-5xl">
            <div className="border-b border-slate-900 pb-3">
              <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2"><BookOpen className="text-blue-500"/> Continuous Learning & Licensing Compliance</h2>
              <p className="text-xs text-slate-400">Track state-approved credits required by the PA Real Estate Commission to maintain active legal authorization fields.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-1 shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Documented Credits</span>
                <div className="text-2xl font-black text-emerald-400">{ceHours.completed} / {ceHours.required} HR</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-1 shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Cycle Completion Metric</span>
                <div className="text-2xl font-black text-blue-400">{Math.round((ceHours.completed / ceHours.required) * 100)}%</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-1 shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Statutory License Deadline</span>
                <div className="text-2xl font-black text-amber-500">{ceHours.deadLine}</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase text-slate-300">Log Valid Real Estate Course Transcript</h3>
              <form onSubmit={handleAddCeCourse} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <input name="c_name" required placeholder="Course Curriculum Title (e.g., RELRA Review)" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <input name="c_hours" type="number" step="0.1" required placeholder="Credits Earned (Hours)" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <select name="c_cat" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 outline-none">
                  <option>Mandatory Core Modules</option>
                  <option>Fair Housing Rules & Guidelines</option>
                  <option>Contractual Contingency Arbitrations</option>
                </select>
                <div className="flex gap-2">
                  <input name="c_date" type="date" required className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-400 outline-none" />
                  <button type="submit" className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase rounded-xl transition">Record Credit</button>
                </div>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b border-slate-800">
                    <th className="p-3">Course Curriculum Module</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Filing Date</th>
                    <th className="p-3 text-right">Credit Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-medium">
                  {ceCourses.map(c => (
                    <tr key={c.id} className="hover:bg-slate-950/20 transition">
                      <td className="p-3 text-white font-bold">{c.name}</td>
                      <td className="p-3"><span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">{c.category}</span></td>
                      <td className="p-3 text-slate-400">{c.date}</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">+{c.hours} HR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 🧾 WORKSPACE MODULE 5: TAX DEDUCTIONS & EXPENSE LEDGER */}
        {activeModule === 'expenses' && (
          <div className="space-y-6 max-w-5xl">
            <div className="border-b border-slate-900 pb-3">
              <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2"><Receipt className="text-blue-500"/> Independent Business Expense Ledger</h2>
              <p className="text-xs text-slate-400">Track professional operational metrics, marketing capital outlays, and brokerage splits to calculate 1099 quarterly Schedule-C tax write-offs.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase text-slate-300">Log New Outbound Business Capital Entry</h3>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <input name="e_desc" required placeholder="Outlay Expenditure Description (e.g., Lockbox Fees)" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <input name="e_amt" type="number" step="0.01" required placeholder="Amount Spend ($)" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <select name="e_cat" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 outline-none">
                  <option value="MLS & Association Fees">MLS & Association Assessment Dues</option>
                  <option value="Marketing & Advertising">Marketing & Print Ad Subscriptions</option>
                  <option value="Software & Technology">Software Tools & Technology</option>
                  <option value="Automotive & Travel">Automotive / Toll Travel Metrics</option>
                </select>
                <div className="flex gap-2">
                  <input name="e_date" type="date" required className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-400 outline-none" />
                  <button type="submit" className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase rounded-xl transition">Log Outlay</button>
                </div>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b border-slate-800">
                    <th className="p-3">Description Parameter</th>
                    <th className="p-3">Category Classification</th>
                    <th className="p-3">Date Record</th>
                    <th className="p-3 text-right">Debit Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-medium text-xs">
                  {expenses.map(e => (
                    <tr key={e.id} className="hover:bg-slate-950/20 transition">
                      <td className="p-3 font-bold text-white">{e.description}</td>
                      <td className="p-3"><span className="bg-slate-950 text-slate-400 text-[10px] px-2 py-0.5 rounded font-bold border border-slate-800">{e.category}</span></td>
                      <td className="p-3 text-slate-500">{e.date}</td>
                      <td className="p-3 text-right text-red-400 font-bold">-${parseFloat(e.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800/60 flex justify-between items-center font-bold text-xs text-slate-400">
                <span>Total Accumulated Operational Deductions (Current Tax Year):</span>
                <span className="text-red-400 font-black text-sm">-${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 👥 WORKSPACE MODULE 6: OFFICE TEAM DIRECTORY PROVISIONER */}
        {activeModule === 'team' && (
          <div className="space-y-6 max-w-xl">
            <div className="border-b border-slate-900 pb-3">
              <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2"><UserPlus className="text-blue-500"/> Office Team Brokerage Provisioner</h2>
              <p className="text-xs text-slate-400">Authorize additional real estate agents onto the platform. Security passkey parameters generate dynamically.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase text-slate-300">Register Onbound Team Agent Profile</h3>
              <form onSubmit={handleAddAgentToRegistry} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Agent Full Corporate Name</label>
                  <input name="agent_name" required placeholder="Enter Legal Name (e.g., Sarah Jenkins)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 font-medium" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider py-3 rounded-xl transition text-[11px]">Generate Network Passkey</button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Authorized System Representatives</h4>
              <div className="divide-y divide-slate-800/40 text-xs font-bold text-white">
                {agentsList.map((agent, idx) => (
                  <div key={idx} className="p-3 hover:bg-slate-950/40 rounded-xl transition flex justify-between items-center">
                    <span>{agent}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 select-all bg-slate-950 px-2 py-1 rounded border border-slate-800/80">Key: {agent.toLowerCase().replace(/\s+/g, '_')}admin2026</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  // SHARED REUSABLE ELEMENT: Renders fully customizable spreadsheet layout arrays with discrete inline save locks
  function renderDealTable(dealsArray) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto shadow-2xl">
        {dealsArray.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-bold uppercase text-[11px] tracking-wider">No transactional records logged within this filtered category scope.</div>
        ) : (
          <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b border-slate-800">
                <th className="p-3">Client Asset Profile</th>
                <th className="p-3">Financial Valuation Metrics</th>
                <th className="p-3">GCI Forecast</th>
                <th className="p-3">Escrow Contract Deadline Progress</th>
                <th className="p-3">Risk Shield</th>
                <th className="p-3">Representative Designation</th>
                <th className="p-3 text-center">Save / Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-medium">
              {dealsArray.map((deal) => {
                const computedGci = (deal.price_parameter || 0) * ((deal.commission_rate || 2.5) / 100);
                return (
                  <tr key={deal.id} className="hover:bg-slate-950/20 transition">
                    <td className="p-3">
                      <div className="font-black text-white text-sm">{deal.client_name}</div>
                      <div className="text-slate-400 font-medium mt-0.5 flex items-center gap-1"><MapPin size={12} className="text-slate-600"/>{deal.property_address}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 items-center">
                        <input id={`price-${deal.id}`} type="number" defaultValue={deal.price_parameter || 0} className="w-20 bg-slate-950 border border-slate-800 rounded p-1.5 font-bold text-white" />
                        <input id={`comm-${deal.id}`} type="number" step="0.1" defaultValue={deal.commission_rate || 2.5} className="w-12 bg-slate-950 border border-slate-800 rounded p-1.5 font-bold text-amber-400" />
                        <select id={`side-${deal.id}`} defaultValue={deal.deal_side || 'Seller'} className="bg-slate-950 border border-slate-800 text-slate-500 rounded p-1.5 font-bold font-mono text-[11px]">
                          <option value="Seller">Seller</option>
                          <option value="Buyer">Buyer</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-3 text-emerald-400 font-black text-xs">
                      ${parseInt(computedGci || 0).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <select id={`stage-${deal.id}`} defaultValue={deal.current_stage} className="bg-slate-950 border border-slate-800 rounded-lg p-2 font-bold text-blue-400 outline-none cursor-pointer">
                        <option>Mutual Acceptance</option>
                        <option>Home Inspection Period</option>
                        <option>Bank Appraisal Flight</option>
                        <option>Title Clear Search</option>
                        <option>Clear to Close 🎉</option>
                      </select>
                    </td>
                    <td className="p-3 space-y-1">
                      <label className="flex items-center gap-1.5 text-[10px] uppercase font-black text-slate-500 cursor-pointer select-none">
                        <input id={`risk-${deal.id}`} type="checkbox" defaultChecked={deal.is_at_risk} className="accent-red-500 h-3.5 w-3.5 rounded border-slate-800" /> Contract Risk
                      </label>
                      <input id={`explain-${deal.id}`} placeholder="Friction summary details..." defaultValue={deal.risk_explanation || ''} className="bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-slate-400 w-full max-w-[130px]" />
                    </td>
                    <td className="p-3">
                      <select id={`agent-${deal.id}`} defaultValue={deal.assigned_agent || 'Jeremy Thieroff'} className="bg-slate-950 border border-slate-800 text-indigo-300 font-bold p-1.5 rounded-lg text-xs outline-none cursor-pointer">
                        {agentsList.map((a, idx) => (
                          <option key={idx} value={a}>{a}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* THE ROW LOCK DOWN SYNC BUTTON */}
                        <button onClick={() => handleSaveRowData(deal.id)} className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white p-2 rounded-lg border border-emerald-500/20 transition" title="Save Ledger Record Updates"><Save size={14}/></button>
                        <Link href={`/tracker/${deal.id}/edit`} className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-amber-500 font-black uppercase text-[10px] transition hover:border-slate-700">Open File</Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
