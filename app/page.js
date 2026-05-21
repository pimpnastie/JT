"use client";
import { agentData } from './data/agentContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Target, MapPin, Phone, Mail, Award, CheckCircle2, Activity, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDeals, setActiveDeals] = useState([]);
  
  // Streams real-time database tracking metrics straight out of Neon Postgres
  useEffect(() => {
    async function streamDeals() {
      try {
        const res = await fetch('/api/leads');
        if (res.ok) {
          const payload = await res.json();
          setActiveDeals(payload.deals || []);
        }
      } catch (err) {
        console.error("Database streaming failure:", err);
      }
    }
    streamDeals();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: e.target.username.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value,
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error("Pipeline failure:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-cbnavy selection:text-white">
      {/* Premium Sticky Mini-Banner */}
      <div className="bg-cbnavy text-white text-[11px] font-bold tracking-widest text-center py-2 px-4 uppercase border-b border-white/10">
        Active North Hills Market Desk · Real-Time Updates Configured
      </div>

      {/* Navigation Layer */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-black text-lg text-slate-900 tracking-tight uppercase">{agentData.profile.team}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{agentData.profile.brokerage}</span>
          </div>
          <Link href="/admin" className="text-xs font-bold text-slate-500 hover:text-cbnavy bg-slate-100 hover:bg-slate-200/80 px-3.5 py-2 rounded-lg transition-all duration-200">
            Secure Agent Dashboard →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-b from-slate-900 via-[#0a192f] to-slate-950 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 px-3 py-1 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Award size={14} /> Top-Tier Pittsburgh Portfolio Strategy
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
              Move Confidently Across The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">North Hills</span> Market.
            </h1>
            <p className="text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              Real estate transactions require precise local tracking. {agentData.profile.name} combines deep market intelligence with data-driven evaluation tools to maximize equity velocity for local home sellers and buyers.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 max-w-md">
              <div className="flex flex-col"><span className="text-xl font-bold text-white">100%</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Local Target</span></div>
              <div className="flex flex-col"><span className="text-xl font-bold text-white">Verified</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MLS Data Link</span></div>
              <div className="flex flex-col"><span className="text-xl font-bold text-white">Direct</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agent Routing</span></div>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-sm shadow-2xl w-full max-w-[340px] group transition-all duration-300 hover:border-white/20">
              <div className="relative rounded-2xl overflow-hidden bg-slate-800 aspect-square border border-white/5 shadow-inner">
                <img 
                  src={agentData.profile.avatarUrl} 
                  alt={agentData.profile.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80";
                  }}
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-bold text-white">{agentData.profile.name}</h3>
                <p className="text-xs text-blue-400 font-semibold">{agentData.profile.title}</p>
                <div className="mt-3 flex justify-center gap-4 text-[11px] font-bold text-slate-400 border-t border-white/5 pt-3">
                  <span>LIC # {agentData.profile.license}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Framework Grid */}
      <main className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LIVE TRANSACTION PERFORMANCE CENTER CONTAINER (Added from last step) */}
        {activeDeals.length > 0 && (
          <div className="col-span-1 lg:col-span-12 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Activity className="text-blue-600 animate-pulse" size={18} /> Real-Time Transaction Performance Center
              </h3>
              <p className="text-xs text-slate-400 font-medium">Verify your exact file phase parameters streaming directly from our active regional board link</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeDeals.map((deal) => (
                <div key={deal.id} className={`p-5 rounded-2xl border relative overflow-hidden transition-all duration-300 ${deal.is_at_risk ? 'bg-amber-50/40 border-amber-200 shadow-amber-100/40' : 'bg-slate-50/50 border-slate-200/80'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active File Portfolio</span>
                      <h4 className="text-base font-black text-slate-900 mt-1">{deal.property_address}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Account Client ID: {deal.client_name.charAt(0)}*** {deal.client_name.split(' ').pop()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${deal.is_at_risk ? 'bg-amber-500 text-slate-950' : 'bg-cbnavy text-white'}`}>
                      {deal.current_stage}
                    </span>
                  </div>

                  {deal.is_at_risk && (
                    <div className="mt-4 bg-white border border-amber-200 rounded-xl p-3 flex gap-2.5 items-start text-xs">
                      <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                      <div className="space-y-1">
                        <span className="font-bold text-amber-950 uppercase text-[9px] tracking-wider block">Operational Action Parameter Flagged</span>
                        <p className="text-slate-600 leading-relaxed font-medium">{deal.risk_explanation || "External structural factors are varying parameter tolerances. Contact direct desk line for mitigation strategy."}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Strategic Listings Section */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Active Strategic Inventory</h2>
            <p className="text-xs text-slate-500 font-medium">Direct live market parameters for active residential opportunities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agentData.featuredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="h-44 overflow-hidden relative bg-slate-100 border-b border-slate-100">
                    <img src={listing.imageUrl} alt={listing.address} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-cbnavy text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                      {listing.status}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-2xl font-black text-slate-950">${listing.price.toLocaleString()}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                      <MapPin size={12} className="text-slate-400" />
                      <span>{listing.address}, {listing.city}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pt-1">{listing.description}</p>
                  </div>
                </div>
                <div className="px-5 py-3.5 flex gap-4 text-[10px] font-black text-slate-500 border-t border-slate-100 bg-slate-50/50 uppercase tracking-wider">
                  <span>{listing.beds} Beds</span><span>{listing.baths} Baths</span><span>{listing.sqft} SqFt</span>
                </div>
              </div>
            ))}
          </div>

          {/* Regional Anchoring Zone */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-blue-400">
              <Target size={18} />
              <h4 className="text-sm font-black uppercase tracking-wider">Primary Regional Focus Aggregations</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Active structural tracking monitors residential equity performance across the following focus boroughs:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {agentData.coreMarkets.map((market, idx) => (
                <span key={idx} className="bg-white/5 border border-white/10 text-slate-200 text-xs px-3 py-1.5 rounded-lg font-medium">
                  {market}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Micro-Conversion Lead Funnel Module */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sticky top-24 space-y-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-900 to-cbnavy" />
            
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Request Valuation Matrix</h2>
              <p className="text-xs text-slate-400 font-medium">Secure direct sync to cloud communication framework</p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
                <div className="flex justify-center text-emerald-500"><CheckCircle2 size={32} /></div>
                <h3 className="font-bold text-emerald-900 text-sm">Pipeline Synchronization Complete</h3>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Your tracking criteria has bypassed corporate delays and updated Jeremy's personal active workspace queue. Expect deployment communication shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Legal Name</label>
                  <input name="username" type="text" required placeholder="John Doe" className="w-full border border-slate-200 rounded-lg bg-slate-50/50 px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-cbnavy transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Verified Email Endpoint</label>
                  <input name="email" type="email" required placeholder="johndoe@gmail.com" className="w-full border border-slate-200 rounded-lg bg-slate-50/50 px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-cbnavy transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Registry (SMS alerts)</label>
                  <input name="phone" type="tel" placeholder="(412) 555-0199" className="w-full border border-slate-200 rounded-lg bg-slate-50/50 px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-cbnavy transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Inquiry Criteria Context</label>
                  <textarea name="message" rows="3" defaultValue="Hi Jeremy, I want a comprehensive home asset valuation strategy run on my target neighborhood parameters." className="w-full border border-slate-200 rounded-lg bg-slate-50/50 px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-cbnavy transition-all duration-200" />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-cbnavy hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? "Synchronizing..." : "Submit Valuation Request"}
                </button>

                <div className="flex justify-center items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">
                  <ShieldCheck size={12} className="text-emerald-500" /> Direct encrypted database pipeline routing
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer Branding Frame */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 mt-20 border-t border-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h5 className="text-white font-bold text-sm tracking-wide uppercase">{agentData.profile.team}</h5>
            <p className="text-xs text-slate-500">Brokerage Affiliation: {agentData.profile.brokerage} · Office Lic # RS349273</p>
            <p className="text-[10px] text-slate-600">Equal Housing Opportunity · Monitored Relational Node</p>
          </div>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
            <span>Direct: {agentData.profile.phone}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}