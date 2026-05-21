"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Home, CheckCircle2, Circle, AlertTriangle, ShieldCheck, PhoneCall } from 'lucide-react';

export default function DedicatedTrackerView() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getParticularDeal() {
      try {
        const res = await fetch('/api/leads');
        if (res.ok) {
          const collections = await res.json();
          const found = collections.deals.find(d => d.id.toString() === id);
          setDeal(found || null);
        }
      } catch (err) {
        console.error("Failed tracking acquisition:", err);
      } finally {
        setLoading(false);
      }
    }
    getParticularDeal();
  }, [id]);

  if (loading) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-xs text-slate-400 uppercase font-black tracking-widest animate-pulse">Syncing client portal tracking lines...</div>;
  
  if (!deal) return (
    <div className="bg-slate-950 min-h-screen flex flex-col items-center justify-center text-slate-200 gap-4">
      <h1 className="text-sm font-black uppercase tracking-wider text-red-400">File Matrix Context Not Found</h1>
      <Link href="/" className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl hover:text-white">Return to Main Desk</Link>
    </div>
  );

  const stages = [
    { title: "Mutual Acceptance", desc: "Contract executed safely by all legal counterparties." },
    { title: "Home Inspection Period", desc: "Structural parameter check and contingency mitigations." },
    { title: "Bank Appraisal Flight", desc: "Independent evaluation verifying asset asset equity parameters." },
    { title: "Title Clear Search", desc: "Ensuring clean lien resolution guarantees out of municipal frameworks." },
    { title: "Clear to Close 🎉", desc: "All parameters synchronized. Moving to keys handover state." }
  ];

  const currentIdx = stages.findIndex(s => s.title === deal.current_stage);

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 font-sans py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Banner Headers */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-8 rounded-3xl text-white border border-white/5 shadow-xl relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Secure Client Status Portfolio</span>
            <h1 className="text-2xl font-black tracking-tight">{deal.property_address}</h1>
            <p className="text-xs text-slate-400 font-medium">Tracking Account ID Matrix: {deal.client_name.charAt(0)}*** {deal.client_name.split(' ').pop()}</p>
          </div>
        </div>

        {/* Risk Shield Escalation Notice */}
        {deal.is_at_risk && (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex gap-4 items-start shadow-sm">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div className="space-y-1 text-xs">
              <h4 className="font-black text-amber-950 uppercase tracking-wide">Active Operational Action Required</h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                {deal.risk_explanation || "External file variables require localized tuning. Do not guess or panic—Jeremy is actively processing contingencies. Contact direct advisory lines below."}
              </p>
            </div>
          </div>
        )}

        {/* Milestone Vertical Array Tracking Module */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 border-b pb-3 flex items-center gap-2">
            <Home size={16} className="text-blue-600" /> Monitored Completion Timeline
          </h3>

          <div className="space-y-8 relative before:absolute before:inset-y-2 before:left-3.5 before:w-0.5 before:bg-slate-100">
            {stages.map((stage, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={idx} className="flex gap-4 items-start relative transition-all duration-300">
                  <div className="mt-0.5 z-10 shrink-0">
                    {isPast ? <CheckCircle2 size={30} className="text-emerald-500 bg-white rounded-full" /> : 
                     isCurrent ? <Activity size={30} className="text-blue-600 bg-blue-50 border border-blue-200 rounded-full p-1 animate-pulse" /> : 
                     <Circle size={30} className="text-slate-200 bg-white rounded-full p-0.5" />}
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <h4 className={`font-black uppercase tracking-tight text-sm ${isCurrent ? 'text-blue-600' : isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                      {stage.title}
                    </h4>
                    <p className={`leading-relaxed ${isCurrent ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Framework Footers */}
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 border-t pt-4">
          <div className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> Direct Encrypted MLS Mirror Link</div>
          <Link href="/" className="hover:text-slate-900 underline">← View Public Homepage</Link>
        </div>

      </div>
    </div>
  );
}