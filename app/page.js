"use client";
import { agentData } from './data/agentContext';
import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
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
      console.error("Transmission fault:", err);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center max-w-6xl mx-auto rounded-b-lg shadow-sm">
        <span className="font-bold text-xl text-slate-900 tracking-tight">{agentData.profile.team}</span>
        <Link href="/admin" className="text-xs font-semibold text-slate-500 hover:text-blue-900 bg-slate-100 px-3 py-1.5 rounded transition">
          Private Workspace Dashboard →
        </Link>
      </nav>

      <header className="bg-gradient-to-r from-slate-900 to-blue-950 text-white py-16 px-6 text-center max-w-6xl mx-auto mt-4 rounded-xl shadow-inner">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">{agentData.profile.name}</h1>
        <p className="text-lg text-blue-200 font-light">{agentData.profile.title} · {agentData.profile.brokerage}</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 border-b pb-2">Active Focus Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agentData.featuredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
                <span className="inline-block bg-blue-50 text-blue-800 text-xs font-bold uppercase px-2 py-0.5 rounded-md">{listing.status}</span>
                <h3 className="text-2xl font-black">${listing.price.toLocaleString()}</h3>
                <p className="text-sm font-medium text-slate-700">{listing.address}, {listing.city}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{listing.description}</p>
                <div className="flex gap-4 text-xs font-bold text-slate-400 border-t pt-2">
                  <span>{listing.beds} BEDS</span><span>{listing.baths} BATHS</span><span>{listing.sqft} SQFT</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 self-start">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Direct Client Intake</h2>
          {submitted ? (
            <div className="bg-green-50 text-green-800 rounded-xl p-5 text-sm text-center font-semibold border border-green-200">
              🎉 Intake metrics securely synchronized to cloud pipeline.
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input name="username" type="text" placeholder="Full Name" required className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-900" />
              <input name="email" type="email" placeholder="Email Address" required className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-900" />
              <input name="phone" type="tel" placeholder="Phone Number" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-900" />
              <textarea name="message" rows="3" defaultValue="Hi Jeremy, I would love to check out your active listings." className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-900" />
              <button type="submit" className="w-full bg-blue-900 text-white text-sm font-bold py-3 rounded-lg hover:bg-blue-950 transition shadow-md">Submit Intake</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}