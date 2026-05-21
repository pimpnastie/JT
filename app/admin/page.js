"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Database, User, Mail, Phone, MessageSquare, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPipeline() {
      try {
        const res = await fetch('/api/leads');
        if (res.ok) setLeads(await res.json());
      } catch (err) {
        console.error("Cloud data tier unreachable:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPipeline();
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-8 font-sans selection:bg-blue-600">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center border-b border-slate-900 pb-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 uppercase">
              <Database className="text-blue-500" /> Pipeline Control Console
            </h1>
            <p className="text-xs text-slate-400">Direct active serverless cloud database stream monitoring node</p>
          </div>
          <Link href="/" className="text-xs font-black text-slate-400 hover:text-white bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-800 transition uppercase tracking-wider">
            ← Exit to Public Site
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl p-6">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-bold uppercase tracking-widest animate-pulse text-xs">Querying cloud storage clusters...</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16 text-slate-500 flex flex-col items-center gap-3">
              <ShieldAlert size={28} className="text-slate-600" />
              <span className="text-xs font-bold uppercase tracking-wider">No customer telemetry packets initialized inside cloud storage yet.</span>
            </div>
          ) : (
            <div className="overflow-x_auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase font-black tracking-widest border-b border-slate-900 text-[10px]">
                    <th className="p-4 rounded-l-xl">Lead Target</th>
                    <th className="p-4">Routing Parameters</th>
                    <th className="p-4">Message Context Payload</th>
                    <th className="p-4 text-center rounded-r-xl">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-950/30 transition">
                      <td className="p-4 font-black text-white text-sm whitespace-nowrap flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-xs">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        {lead.name}
                      </td>
                      <td className="p-4 text-slate-300 space-y-1 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5"><Mail size={12} className="text-slate-500" /> {lead.email}</div>
                        <div className="flex items-center gap-1.5 text-slate-400"><Phone size={12} className="text-slate-500" /> {lead.phone || 'None Logged'}</div>
                      </td>
                      <td className="p-4 text-slate-400 max-w-xs break-words leading-relaxed font-normal">
                        <div className="flex items-start gap-1.5"><MessageSquare size={12} className="text-slate-500 mt-0.5 shrink-0" /> {lead.message}</div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}