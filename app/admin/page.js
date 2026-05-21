"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <div className="bg-slate-900 min-h-screen text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Administrative Lead Center</h1>
            <p className="text-sm text-slate-400 mt-1">Direct live serverless cloud stream tracking matrix</p>
          </div>
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 transition">
            ← View Consumer Frontend
          </Link>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl p-5">
          {loading ? (
            <div className="text-center py-12 text-slate-500 animate-pulse">Querying serverless cluster data tables...</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16 text-slate-500">No telemetry entries tracked inside cloud storage metrics yet.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-900 text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                  <th className="p-4">Identified Target</th>
                  <th className="p-4">Routing Parameters</th>
                  <th className="p-4">Context Payload</th>
                  <th className="p-4 text-center">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-4 font-bold text-white">{lead.name}</td>
                    <td className="p-4 text-xs text-slate-300">
                      <div>📧 {lead.email}</div>
                      <div className="text-slate-500 mt-0.5">📱 {lead.phone || 'None Logged'}</div>
                    </td>
                    <td className="p-4 text-xs text-slate-400 max-w-xs truncate">{lead.message}</td>
                    <td className="p-4 text-center">
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-emerald-500/20">
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}