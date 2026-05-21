"use client";
import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone, FileText, Send, ArrowRight, ShieldCheck, Sparkles, Building2, Landmark, HelpCircle } from 'lucide-react';

// Static agent profile matrix fallback context
const agentData = {
  name: "Jeremy Thieroff",
  title: "Sales Associate & Market Expert",
  license: "LIC # RS349273",
  phone: "412-605-4566",
  email: "hallamed@gmail.com",
  avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  bio: "Specializing in the greater Pittsburgh residential landscape, delivering institutional-grade market data, seamless transaction workflows, and aggressive negotiation strategies for buyers and sellers alike.",
  featuredListings: [
    {
      id: 1,
      price: 289900,
      address: "3411 Mount Troy Road",
      city: "Pittsburgh",
      status: "Active",
      beds: 3,
      baths: 2,
      sqft: 1650,
      description: "Beautifully modernized property sitting on a phenomenal lot with pristine access infrastructure pathways.",
      imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80"
    }
  ]
};

export default function PublicLandingPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forwards public client requests directly into the main CRM leads incoming queue table
  const handleIntakeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      name: e.target.client_name.value,
      email: e.target.client_email.value,
      phone: e.target.client_phone.value,
      message: e.target.client_message.value,
      category: e.target.intake_category.value
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setFormSubmitted(true);
        e.target.reset();
      }
    } catch (err) {
      console.error("Failed to forward public lead intake routing:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 🏙️ TOP EXECUTIVE GLOBAL HEADER BANNER */}
      <header className="bg-slate-950 text-white py-4 px-6 border-b border-slate-900 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="text-blue-500" size={20} />
            <span className="text-xs font-black uppercase tracking-widest text-slate-100">Jeremy Thieroff <span className="text-blue-500">|</span> Brokerage Desk</span>
          </div>
          <Link href="/admin" className="text-[10px] font-black uppercase tracking-wider bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition">
            Secure Agent Dashboard →
          </Link>
        </div>
      </header>

      {/* 👤 ARCHITECTURAL PROFILE HERO BLOCK */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 text-white py-16 px-6 border-b border-slate-950">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="w-40 h-40 rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800 shrink-0 relative bg-slate-900">
            <img src={agentData.avatarUrl} alt={agentData.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 px-2 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/10">Licensed Real Estate Professional</span>
              <h1 className="text-3xl font-black tracking-tight">{agentData.name}</h1>
              <p className="text-xs text-slate-400 font-semibold">{agentData.title} · <span className="font-mono text-slate-500">{agentData.license}</span></p>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">{agentData.bio}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-slate-400 pt-2">
              <a href={`tel:${agentData.phone}`} className="flex items-center gap-1.5 hover:text-white transition"><Phone size={14} className="text-blue-500" /> {agentData.phone}</a>
              <a href={`mailto:${agentData.email}`} className="flex items-center gap-1.5 hover:text-white transition"><Mail size={14} className="text-blue-500" /> {agentData.email}</a>
            </div>
          </div>
        </div>
      </section>

      {/* 🗺️ MAIN PUBLIC GRID PIPELINE */}
      <main className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COMPONENT: STRATEGIC INVENTORY SHOWCASE CONTAINER */}
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
                    <span className="absolute top-3 left-3 bg-slate-950 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
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
        </div>

        {/* RIGHT COMPONENT: CONTEXTUAL CRM INBOUND INTENTION SUBMISSION MODULE */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl space-y-6 sticky top-24">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">Direct MLS Query Terminal</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 flex items-center gap-1.5"><Landmark size={18} className="text-blue-600" /> Request Valuation Matrix</h2>
              <p className="text-xs text-slate-500 font-medium">Submit listing intent properties or criteria targets for algorithmic evaluation.</p>
            </div>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2 animate-fade-in">
                <div className="flex justify-center text-emerald-500"><ShieldCheck size={32} /></div>
                <h4 className="font-black text-xs uppercase tracking-wider text-emerald-900">Intake Document Handshake Complete</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">Your data packet has cleared cloud routing gates. Jeremy will verify the custom portfolio coordinates shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleIntakeSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Intention Classification Category</label>
                  <select name="intake_category" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:border-blue-500 font-bold cursor-pointer">
                    <option value="Listing Valuation Request">Seller Representation Inquiry (List Property)</option>
                    <option value="Buyer Representation Request">Buyer Strategy Consultation (Acquire Assets)</option>
                    <option value="Cooperating Agent Request">Brokerage/Cooperating Representative Request</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Your Name</label>
                    <input name="client_name" required type="text" placeholder="Johnathan Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 font-medium text-slate-800" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Direct Telephone</label>
                    <input name="client_phone" required type="tel" placeholder="412-555-0199" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 font-medium text-slate-800" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Email Endpoint</label>
                  <input name="client_email" required type="email" placeholder="john@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 font-medium text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Property Matrix Parameters or Notes</label>
                  <textarea name="client_message" required rows="4" placeholder="Detail specific addresses, home updates, or target school districts..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 leading-relaxed font-medium text-slate-800" />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black uppercase py-3.5 rounded-xl tracking-wider transition shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50">
                  {loading ? "Transmitting Pipeline Core..." : "Submit Valuation Request"} <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

      </main>

      {/* 🔒 SECURITY AND COMPLIANCE INTEGRATION FOOTER */}
      <footer className="bg-slate-950 text-slate-500 py-12 px-6 border-t border-slate-900 text-center space-y-3 text-[10px] font-bold uppercase tracking-widest">
        <div className="flex justify-center items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Real-Time MLS Data Integration Encrypted Pipeline Active</div>
        <p className="text-slate-600">© 2026 Jeremy Thieroff Corporate Brokerage Holdings · Equal Housing Opportunity</p>
      </footer>

    </div>
  );
}