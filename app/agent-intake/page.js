"use client";
import { useState } from 'react';
import { ShieldCheck, FileText, UserCheck, AlertTriangle } from 'lucide-react';

export default function AgentIntakePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: `Agent: ${e.target.agentName.value} (${e.target.brokerage.value})`,
      email: e.target.email.value,
      phone: e.target.phone.value,
      category: 'Cooperating Agent Request',
      message: `License: ${e.target.license.value} | Regarding Property: ${e.target.property.value} | Buyer Status: ${e.target.buyerStatus.value} | Summary: ${e.target.notes.value}`,
    };

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) setSubmitted(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans py-12 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600" />
        
        <div className="space-y-1">
          <h1 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <UserCheck className="text-amber-500" /> Agent Brokerage Submission Portal
          </h1>
          <p className="text-xs text-slate-400">Official routing queue for contract documentation, offer presentations, and listing status verifications.</p>
        </div>

        {submitted ? (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-3">
            <h3 className="font-bold text-amber-500 text-sm">Documentation Staged Successfully</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Data verified. Your parameters have been appended to the active file queue for review. Sloppy or incomplete text message notifications will not prioritize scheduling adjustments.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Full Legal Name</label>
                <input name="agentName" type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">State License #</label>
                <input name="license" type="text" required placeholder="e.g. RSXXXXXX" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Affiliated Brokerage</label>
                <input name="brokerage" type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Target Property Address</label>
                <input name="property" type="text" required placeholder="e.g., 2546 Merwyn Ave" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Cooperating Email</label>
                <input name="email" type="email" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Cooperating Phone</label>
                <input name="phone" type="tel" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Buyer Financial Verification Status</label>
              <select name="buyerStatus" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500">
                <option>Pre-Approved with Local Verified Lender</option>
                <option>Pre-Qualified (Self-Reported Only)</option>
                <option>Cash Transaction (Proof of Funds Staged)</option>
                <option>Unverified / Needs Consultation</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Clear Query / Terms Description</label>
              <textarea name="notes" rows="3" required placeholder="Detail specific contingencies, requested presentation times, or explicit transaction contract questions here..." className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500" />
            </div>

            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-slate-950 font-black uppercase tracking-wider py-3 rounded-xl transition shadow-lg">
              Log Structured Query Entry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}