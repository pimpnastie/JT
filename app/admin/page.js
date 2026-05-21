"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Database, User, Activity, Sparkles, MessageSquare, Briefcase, ExternalLink, 
  Settings2, Lock, Users, UserPlus, Save, DollarSign, Percent, BookOpen, 
  Receipt, ClipboardList, LogOut, CheckCircle, Building2, MapPin, AlertCircle, Plus
} from 'lucide-react';

export default function AdminDashboard() {
  // Authentication & Identity States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('Jeremy Thieroff');
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Dynamic Layout Navigation Modules
  const [activeModule, setActiveModule] = useState('pipeline'); // 'pipeline', 'agent_mgmt', 'ce_tracker', 'expenses'
  const [viewTab, setViewTab] = useState('mine'); // 'mine' vs 'team'

  // Central Database Pipeline Storage
  const [data, setData] = useState({ leads: [], deals: [] });
  const [loading, setLoading] = useState(true);
  
  // Custom Dynamic Office Registry
  const [agentsList, setAgentsList] = useState(['Jeremy Thieroff', 'Team Partner']);

  // Dynamic Inline Row-Level Editing State Buffer Engine
  const [editingDeals, setEditingDeals] = useState({});

  // Lead Conversion Inline Form Tracking Buffer
  const [convertingLeadId, setConvertingLeadId] = useState(null);
  const [conversionAddress, setConversionAddress] = useState('');

  // Persistent PA CE Tracker Data Structures
  const [ceHours, setCeHours] = useState({ completed: 6, required: 14, deadLine: 'May 31, 2026' });
  const [ceCourses, setCeCourses] = useState([
    { id: 1, name: 'PA Real Estate Core Law & Rules', hours: 3.5, date: '2025-11-12' },
    { id: 2, name: 'Fair Housing Mandate Course', hours: 2.5, date: '2026-02-18' }
  ]);

  // Persistent Tax Deduction Business Expense Ledger Data Structures
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'West Penn MLS Quarterly Assessment Fees', amount: 145.00, category: 'MLS Dues', date: '2026-04-01' },
    { id: 2, description: 'Facebook Targeted Geofence Ad Runs - Open House', amount: 75.00, category: 'Marketing', date: '2026-05-10' }
  ]);

  useEffect(() => {
    const sessionToken = localStorage.getItem('admin_session_active');
    const savedAgentName = localStorage.getItem('active_agent_identity');
    const savedAgents = localStorage.getItem('crm_registered_agents');
    const savedCeCourses = localStorage.getItem('crm_ce_courses');
    const savedExpenses = localStorage.getItem('crm_expenses');
    
    if (sessionToken === 'true' && savedAgentName) {
      setIsAuthenticated(true);
      setCurrentUser(savedAgentName);
    }
    if (savedAgents) {
      setAgentsList(JSON.parse(savedAgents));
    }
    if (savedCeCourses) {
      const courses = JSON.parse(savedCeCourses);
      setCeCourses(courses);
      setCeHours(prev => ({ ...prev, completed: courses.reduce((sum, c) => sum + c.hours, 0) }));
    }
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
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
        
        // Initialize editing state buffer with database baseline metrics
        const initialEditBuffer = {};
        (payload.deals || []).forEach(deal => {
          initialEditBuffer[deal.id] = {
            current_stage: deal.current_stage || 'Mutual Acceptance',
            deal_side: deal.deal_side || 'Seller',
            price_parameter: deal.price_parameter || 0,
            commission_rate: deal.commission_rate || 2.5,
            assigned_agent: deal.assigned_agent || 'Jeremy Thieroff',
            is_at_risk: deal.is_at_risk || false,
            risk_explanation: deal.risk_explanation || ''
          };
        });
        setEditingDeals(initialEditBuffer);
      }
    } catch (err) {
      console.error("Data pipeline load fault:", err);
    } finally {
      setLoading(false);
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
      if (matched) {
        logUserIn(matched);
      } else {
        setAuthError(true);
      }
    } else {
      setAuthError(true);
    }
  };

  // Onboard new realtors to the operational environment dynamically from the WebUI
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

  // Clean Native Inline Lead Conversion Trigger Handshake
  const handleConvertLeadSubmit = async (leadId) => {
    if (!conversionAddress.trim()) return;

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'convert_lead',
        lead_id: leadId,
        property_address: conversionAddress,
        deal_side: 'Buyer',
        assigned_agent: currentUser
      })
    });
    if (res.ok) {
      setConvertingLeadId(null);
      setConversionAddress('');
      fetchClusterData();
    }
  };

  // State-driven change logging engine for row inputs
  const handleRowInputChange = (dealId, fieldName, value) => {
    setEditingDeals(prev => ({
      ...prev,
      [dealId]: {
        ...prev[dealId],
        [fieldName]: value
      }
    }));
  };

  // EXPLICIT ROW SAVE FUNCTION UTILIZING COMPONENT STATE BUFFER
  const handleSaveRowData = async (dealId) => {
    const dealState = editingDeals[dealId];
    if (!dealState) return;

    const res = await fetch('/api/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: dealId,
        current_stage: dealState.current_stage,
        deal_side: dealState.deal_side,
        price_parameter: parseFloat(dealState.price_parameter) || 0,
        commission_rate: parseFloat(dealState.commission_rate) || 0,
        assigned_agent: dealState.assigned_agent,
        is_at_risk: dealState.is_at_risk,
        risk_explanation: dealState.risk_explanation
      })
    });

    if (res.ok) {
      alert(`✓ Database Synchronized for ID row XA-${dealId}`);
      fetchClusterData();
    }
  };

  // CE Course Adding Utilities with LocalStorage Tracking
  const handleAddCeCourse = (e) => {
    e.preventDefault();
    const newCourse = {
      id: Date.now(),
      name: e.target.c_name.value,
      hours: parseFloat(e.target.c_hours.value) || 0,
      date: e.target.c_date.value
    };
    const updatedCourses = [newCourse, ...ceCourses];
    setCeCourses(updatedCourses);
    localStorage.setItem('crm_ce_courses', JSON.stringify(updatedCourses));
    
    const completedHours = updatedCourses.reduce((sum, c) => sum + c.hours, 0);
    setCeHours({ ...ceHours, completed: completedHours });
    e.target.reset();
  };

  // Expense Appending Utilities with LocalStorage Tracking
  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExp = {
      id: Date.now(),
      description: e.target.e_desc.value,
      amount: parseFloat(e.target.e_amt.value) || 0,
      category: e.target.e_cat.value,
      date: e.target.e_date.value
    };
    const updatedExpenses = [newExp, ...expenses];
    setExpenses(updatedExpenses);
    localStorage.setItem('crm_expenses', JSON.stringify(updatedExpenses));
    e.target.reset();
  };

  // Unified Workspace String Normalization Filtering Matchers
  const normalizedUser = (currentUser || 'Jeremy Thieroff').trim().toLowerCase();
  
  const personalDeals = data.deals.filter(d => 
    (d.assigned_agent || 'Jeremy Thieroff').trim().toLowerCase() === normalizedUser
  );
  
  const teamDeals = data.deals.filter(d => 
    (d.assigned_agent || 'Jeremy Thieroff').trim().toLowerCase() !== normalizedUser
  );
  
  const activeDealsDisplay = viewTab === 'mine' ? personalDeals : teamDeals;

  const listingDeals = activeDealsDisplay.filter(d => (d?.deal_side || 'Seller') === 'Seller');
  const escrowDeals = activeDealsDisplay.filter(d => (d?.deal_side || 'Seller') === 'Buyer');

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col lg:flex-row">
      
      {/* 🧭 NAVIGATION SIDEBAR CONTAINER */}
      <div className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-6 space-y-8 shrink-0">
        <div className="space-y-1">
          <div className="text-sm font-black tracking-tight flex items-center gap-2 uppercase"><Database className="text-blue-500" /> Elite CRM Desk</div>
          <p className="text-[11px] text-slate-500 font-medium">Rep: <span className="text-slate-300 font-bold">{currentUser}</span></p>
        </div>

        <nav className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
          <button onClick={() => setActiveModule('pipeline')} className={`w-full text-left p-3 rounded-xl transition flex items-center gap-2 ${activeModule === 'pipeline' ? 'bg-blue-600 text-white' : 'hover:bg-slate-950 hover:text-white'}`}><Briefcase size={16}/> Transaction Pipelines</button>
          <button onClick={() => setActiveModule('ce_tracker')} className={`w-full text-left p-3 rounded-xl transition flex items-center gap-2 ${activeModule === 'ce_tracker' ? 'bg-blue-600 text-white' : 'hover:bg-slate-950 hover:text-white'}`}><BookOpen size={16}/> PA Continuing Ed (CE)</button>
          <button onClick={() => setActiveModule('expenses')} className={`w-full text-left p-3 rounded-xl transition flex items-center gap-2 ${activeModule === 'expenses' ? 'bg-blue-600 text-white' : 'hover:bg-slate-950 hover:text-white'}`}><Receipt size={16}/> Business Expenses</button>
          <button onClick={() => setActiveModule('agent_mgmt')} className={`w-full text-left p-3 rounded-xl transition flex items-center gap-2 ${activeModule === 'agent_mgmt' ? 'bg-blue-600 text-white' : 'hover:bg-slate-950 hover:text-white'}`}><UserPlus size={16}/> Office Team Directory</button>
        </nav>

        <button onClick={handleLogout} className="w-full mt-12 bg-slate-950 border border-slate-800/80 p-2.5 rounded-xl text-[10px] font-black uppercase text-red-400 hover:bg-red-500/10 transition flex items-center justify-center gap-1.5"><LogOut size={12}/> Lock Session</button>
      </div>

      {/* MAIN DATA MODULE HUB DISPLAY GRID */}
      <div className="flex-1 p-8 space-y-8 overflow-x-hidden">
        
        {/* MODULE 1: TRANSACTIONS & ESCROW TABLES */}
        {activeModule === 'pipeline' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h2 className="text-xs font-black uppercase text-blue-400 flex items-center gap-2"><Sparkles size={14}/> Provision Active Client Escrow File</h2>
              <form onSubmit={handleCreateDeal} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
                <input id="client" name="client" required placeholder="Client Legal Name" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <input id="address" name="address" required placeholder="Property Address" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <select id="stage" name="stage" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-blue-400 font-bold outline-none">
                  <option>Mutual Acceptance</option>
                  <option>Home Inspection Period</option>
                  <option>Bank Appraisal Flight</option>
                  <option>Title Clear Search</option>
                  <option>Clear to Close 🎉</option>
                </select>
                <select id="deal_side" name="deal_side" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-indigo-400 font-bold outline-none">
                  <option value="Seller">Seller (Listing)</option>
                  <option value="Buyer">Buyer (Representation)</option>
                </select>
                <div className="flex gap-2">
                  <input id="price" name="price" type="number" placeholder="Price ($)" className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                  <input id="comm" name="comm" type="number" step="0.1" placeholder="Comm %" defaultValue="2.5" className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                </div>
                <button type="submit" className="lg:col-span-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-3 rounded-xl transition tracking-wider">Launch New Tracker Portfolio</button>
              </form>
            </div>

            <div className="flex border-b border-slate-900 gap-2">
              <button onClick={() => setViewTab('mine')} className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${viewTab === 'mine' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-500'}`}>My Desk Operations ({personalDeals.length})</button>
              <button onClick={() => setViewTab('team')} className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${viewTab === 'team' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-500'}`}>Team Operational Pipeline ({teamDeals.length})</button>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5"><Building2 size={14} className="text-blue-500"/> Listing Portfolio (Sellers)</h3>
                <DealPipelineTable dealsArray={listingDeals} editingDeals={editingDeals} agentsList={agentsList} loading={loading} onInputChange={handleRowInputChange} onSave={handleSaveRowData} />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5"><Briefcase size={14} className="text-indigo-400"/> Escrow Pipeline (Buyers)</h3>
                <DealPipelineTable dealsArray={escrowDeals} editingDeals={editingDeals} agentsList={agentsList} loading={loading} onInputChange={handleRowInputChange} onSave={handleSaveRowData} />
              </div>
            </div>

            {/* Inbound Lead Inbox Streams */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5"><MessageSquare size={14} className="text-emerald-500" /> Universal Central Incoming Leads</h3>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 divide-y divide-slate-800/40 shadow-xl">
                {data.leads.length === 0 ? (
                  <div className="text-center py-6 text-slate-600 font-bold uppercase text-[10px]">Lead buffer storage queue clear.</div>
                ) : (
                  data.leads.map((l) => (
                    <div key={l.id} className="p-4 hover:bg-slate-950/20 rounded-xl flex flex-col justify-between gap-4 transition">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1 max-w-3xl">
                          <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-black tracking-wider uppercase">{l.category}</span>
                          <div className="font-bold text-white text-sm">{l.name} · <span className="text-slate-400 text-xs font-medium">{l.email} | {l.phone}</span></div>
                          <p className="text-slate-400 bg-slate-950/40 border border-slate-800/40 p-2.5 rounded-lg text-xs leading-relaxed font-medium mt-1">{l.message}</p>
                        </div>
                        {convertingLeadId !== l.id && (
                          <button onClick={() => setConvertingLeadId(l.id)} className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 px-3 py-2 rounded-xl text-emerald-400 font-black uppercase text-[10px] tracking-wider transition shrink-0">Claim & Convert Client →</button>
                        )}
                      </div>

                      {/* Clean Native Inline Conversion Card instead of alert prompts */}
                      {convertingLeadId === l.id && (
                        <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl flex flex-col sm:flex-row gap-3 items-end animate-fade-in">
                          <div className="space-y-1 flex-1 w-full">
                            <label className="text-[9px] uppercase font-black tracking-wider text-slate-500 flex items-center gap-1"><AlertCircle size={10}/> Establish Conversion Target Address</label>
                            <input type="text" value={conversionAddress} onChange={(e) => setConversionAddress(e.target.value)} placeholder="Enter Property escrow target string parameters..." className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-emerald-500" />
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={() => handleConvertLeadSubmit(l.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] px-4 py-2.5 rounded-lg tracking-wider transition w-full sm:w-auto">Finalize Representation Contract</button>
                            <button onClick={() => { setConvertingLeadId(null); setConversionAddress(''); }} className="bg-slate-900 border border-slate-800 text-slate-400 font-bold uppercase text-[10px] px-3 py-2.5 rounded-lg transition">Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: PERSISTENT CONTINUING EDUCATION MODULE */}
        {activeModule === 'ce_tracker' && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-slate-900 pb-3">
              <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2"><BookOpen className="text-blue-500"/> Personal Continuing Education Suite</h2>
              <p className="text-xs text-slate-400">Monitor Pennsylvania State Real Estate Commission biennial compliance benchmarks dynamically.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-1 shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Hours Documented</span>
                <div className="text-2xl font-black text-emerald-400">{ceHours.completed} / {ceHours.required} HR</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-1 shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">PA Cycle Progress</span>
                <div className="text-2xl font-black text-blue-400">{Math.round((ceHours.completed / ceHours.required) * 100)}%</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-1 shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">State Filing Deadline</span>
                <div className="text-2xl font-black text-amber-500">{ceHours.deadLine}</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Log State-Approved Completed Course Credit</h3>
              <form onSubmit={handleAddCeCourse} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <input name="c_name" required placeholder="Course Subject Title (e.g., Code of Ethics Update)" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <input name="c_hours" type="number" step="0.1" required placeholder="Credit Hours (e.g., 3.5)" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <div className="flex gap-2">
                  <input name="c_date" type="date" required className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-400 outline-none" />
                  <button type="submit" className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider rounded-xl transition">Log Credit</button>
                </div>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b border-slate-800">
                    <th className="p-3">Course Curriculum Module</th>
                    <th className="p-3">Filing Date</th>
                    <th className="p-3 text-right">Credit Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-medium">
                  {ceCourses.map(c => (
                    <tr key={c.id} className="hover:bg-slate-950/20 transition">
                      <td className="p-3 text-white font-bold">{c.name}</td>
                      <td className="p-3 text-slate-400">{c.date}</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">+{c.hours} HR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 3: PERSISTENT BUSINESS EXPENSES LEDGER */}
        {activeModule === 'expenses' && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-slate-900 pb-3">
              <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2"><Receipt className="text-blue-500"/> Independent Business Expense Ledger</h2>
              <p className="text-xs text-slate-400">Track structural operational expenses, marketing capital outlays, and vehicle tracking metrics for Schedule-C writeoffs.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase text-slate-300">Log New Outbound Business Capital Entry</h3>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <input name="e_desc" required placeholder="Item Outlay Description" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <input name="e_amt" type="number" step="0.01" required placeholder="Amount Spend ($)" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" />
                <select name="e_cat" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 outline-none">
                  <option>MLS & Association Assessment Dues</option>
                  <option>Marketing & Print Ads Advertising</option>
                  <option>Automotive / Toll Travel Metrics</option>
                  <option>Software Tools & Technology</option>
                </select>
                <div className="flex gap-2">
                  <input name="e_date" type="date" required className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-400 outline-none" />
                  <button type="submit" className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider rounded-xl transition">Log Outlay</button>
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

        {/* MODULE 4: OFFICE TEAM REGISTRY SECTION */}
        {activeModule === 'agent_mgmt' && (
          <div className="space-y-6 max-w-xl">
            <div className="border-b border-slate-900 pb-3">
              <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2"><UserPlus className="text-blue-500"/> Office Team Brokerage Provisioner</h2>
              <p className="text-xs text-slate-400">Authorize additional real estate agents onto the WebUI infrastructure cleanly. Generates passkeys automatically.</p>
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
}

// ==========================================
// 🛡️ EXTRACTED STANDALONE PIPELINE COMPONENT
// ==========================================
function DealPipelineTable({ dealsArray, editingDeals, agentsList, loading, onInputChange, onSave }) {
  if (loading) {
    return <div className="text-center py-6 text-slate-500 font-bold uppercase animate-pulse text-xs">Querying Postgres Cloud Modules...</div>;
  }
  
  if (dealsArray.length === 0) {
    return <div className="text-center py-6 text-slate-600 font-bold uppercase text-[10px] bg-slate-900/40 border border-slate-800/60 rounded-xl">No active properties inside this funnel mapping segment.</div>;
  }

  return (
    /* 📱 Outer Scroll Wrapper for Mobile Responsiveness */
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 shadow-2xl bg-slate-900">
      <table className="w-full text-left text-xs border-collapse min-w-[950px]">
        <thead>
          <tr className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b border-slate-800">
            <th className="p-3">Client / Listing Context</th>
            <th className="p-3">Parameters</th>
            <th className="p-3">Milestone Escrow Phase</th>
            <th className="p-3">Risk Configuration</th>
            <th className="p-3">Representative Owner</th>
            <th className="p-3 text-center">Save / Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/40">
          {dealsArray.map((deal) => {
            const currentEditState = editingDeals[deal.id] || {
              deal_side: deal.deal_side || 'Seller',
              price_parameter: deal.price_parameter || 0,
              commission_rate: deal.commission_rate || 2.5,
              current_stage: deal.current_stage || 'Mutual Acceptance',
              is_at_risk: deal.is_at_risk || false,
              risk_explanation: deal.risk_explanation || '',
              assigned_agent: deal.assigned_agent || 'Jeremy Thieroff'
            };

            return (
              <tr key={deal.id} className="hover:bg-slate-950/20 transition">
                <td className="p-3">
                  <div className="font-black text-white text-sm">{deal.client_name}</div>
                  <div className="text-slate-400 font-medium mt-0.5 flex items-center gap-1"><MapPin size={12} className="text-slate-600"/>{deal.property_address}</div>
                </td>
                
                {/* ⚡ Controlled Inputs Tied Strictly to Component Edit State Buffer */}
                <td className="p-3 space-y-1">
                  <select 
                    value={currentEditState.deal_side} 
                    onChange={(e) => onInputChange(deal.id, 'deal_side', e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 rounded p-1 font-bold font-mono text-[11px]"
                  >
                    <option value="Seller">Seller</option>
                    <option value="Buyer">Buyer</option>
                  </select>
                  <div className="flex gap-1 items-center mt-1">
                    <div className="relative">
                      <span className="absolute left-1 top-1.5 text-slate-600 text-[9px] font-bold">$</span>
                      <input 
                        type="number" 
                        value={currentEditState.price_parameter} 
                        onChange={(e) => onInputChange(deal.id, 'price_parameter', e.target.value)}
                        className="w-16 bg-slate-950 border border-slate-800 rounded p-1 pl-3 font-bold text-white text-[11px] outline-none" 
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute right-1 top-1.5 text-slate-600 text-[9px] font-bold">%</span>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={currentEditState.commission_rate} 
                        onChange={(e) => onInputChange(deal.id, 'commission_rate', e.target.value)}
                        className="w-12 bg-slate-950 border border-slate-800 rounded p-1 pr-3 font-bold text-amber-400 text-[11px] outline-none" 
                      />
                    </div>
                  </div>
                </td>
                
                <td className="p-3">
                  <select 
                    value={currentEditState.current_stage} 
                    onChange={(e) => onInputChange(deal.id, 'current_stage', e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 font-bold text-blue-400 outline-none cursor-pointer"
                  >
                    <option>Mutual Acceptance</option>
                    <option>Home Inspection Period</option>
                    <option>Bank Appraisal Flight</option>
                    <option>Title Clear Search</option>
                    <option>Clear to Close 🎉</option>
                  </select>
                </td>
                
                <td className="p-3 space-y-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[10px] uppercase font-black text-slate-400 select-none">
                    <input 
                      type="checkbox" 
                      checked={currentEditState.is_at_risk} 
                      onChange={(e) => onInputChange(deal.id, 'is_at_risk', e.target.checked)}
                      className="accent-red-500 h-3.5 w-3.5 rounded border-slate-800" 
                    /> At Risk
                  </label>
                  <input 
                    type="text"
                    placeholder="Friction notes..." 
                    value={currentEditState.risk_explanation} 
                    onChange={(e) => onInputChange(deal.id, 'risk_explanation', e.target.value)}
                    disabled={!currentEditState.is_at_risk}
                    className="bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-slate-300 w-full max-w-[140px] outline-none disabled:opacity-40" 
                  />
                </td>
                
                <td className="p-3">
                  <select 
                    value={currentEditState.assigned_agent} 
                    onChange={(e) => onInputChange(deal.id, 'assigned_agent', e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-indigo-300 font-bold p-1.5 rounded-lg text-xs outline-none cursor-pointer"
                  >
                    {agentsList.map((a, idx) => (
                      <option key={idx} value={a}>{a}</option>
                    ))}
                  </select>
                </td>
                
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onSave(deal.id)} className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white p-2 rounded-lg border border-emerald-500/20 transition" title="Save Dynamic Local Buffer Changes"><Save size={14}/></button>
                    <a href={`/tracker/${deal.id}`} target="_blank" rel="noreferrer" className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-blue-400 font-bold uppercase text-[10px] transition hover:border-slate-700">Portal</a>
                    <Link href={`/tracker/${deal.id}/edit`} className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-amber-500 font-bold uppercase text-[10px] transition hover:border-slate-700">Open</Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}