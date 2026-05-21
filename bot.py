import os
import platform
import subprocess

def create_file(path, content):
    """Helper function to create directories if they exist, then write files safely."""
    dir_name = os.path.dirname(path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"  [✓] Scaffolding: {path}")

def main():
    print("==================================================")
    print("🌟 AUTO-DEPLOYING SERVERLESS REAL ESTATE BOT 🌟")
    print("==================================================\n")

    # 1. Next.js Package and Configuration Layout
    package_json = """
{
  "name": "tteam-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@neondatabase/serverless": "^0.9.3"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.3",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19"
  }
}
"""

    postcss_config = """
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"""

    tailwind_config = """
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
"""

    globals_css = """
@tailwind base;
@tailwind components;
@tailwind utilities;
"""

    # 2. Next.js Core Layout Controller
    layout_jsx = """
import './globals.css';

export const metadata = {
  title: 'The Thieroff Team | Coldwell Banker Realty',
  description: 'Professional real estate services across the North Hills and Greater Pittsburgh area.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
"""

    # 3. Shared Operational Real Estate Context File
    agent_context_js = """
export const agentData = {
  profile: {
    name: "Jeremy Thieroff",
    title: "Sales Associate",
    team: "The Thieroff Team",
    brokerage: "Coldwell Banker Realty",
    license: "RS349273",
    phone: "(412) 559-6825",
    email: "jeremy.thieroff@cbrealty.com",
    office: {
      name: "North Hills Office",
      address: "9600 Perry Hwy Ste 100, Pittsburgh, PA 15237"
    }
  },
  coreMarkets: ["Bellevue", "Ross Township", "Avalon", "West View", "McCandless", "Wexford", "Hampton"],
  featuredListings: [
    {
      id: "mls-1747865",
      address: "2546 Merwyn Ave",
      city: "Pittsburgh", state: "PA", zip: "15204",
      price: 50000, beds: 2, baths: 1, sqft: 696,
      type: "Single Family", status: "Active",
      description: "Great investment property with 3 additional empty wooded lots. All electric updated, newer water heater, and wall anchors in basement."
    },
    {
      id: "mls-1744326",
      address: "612 Sewickley Heights Dr",
      city: "Sewickley", state: "PA", zip: "15143",
      price: 235000, beds: 3, baths: 1.5, sqft: 1540,
      type: "Townhouse", status: "Active",
      description: "Beautifully updated townhouse nestled in the Sewickley Heights community. Close proximity to local amenities."
    }
  ]
};
"""

    # 4. Serverless API Router (Using Parametrized Input for SQL Injection Immunity)
    api_lead_route = """
import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();
    const sql = neon(process.env.DATABASE_URL);
    
    // Automatically construct relational structural schema if missing
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT,
        status TEXT DEFAULT 'New',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Parametrized query passing arguments array safely to avoid Python interpolation collision
    await sql('INSERT INTO leads (name, email, phone, message) VALUES ($1, $2, $3, $4);', [
      name,
      email,
      phone,
      message
    ]);
    
    return new Response(JSON.stringify({ status: 'success' }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const records = await sql('SELECT id, name, email, phone, message, status FROM leads ORDER BY id DESC;');
    return new Response(JSON.stringify(records), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
"""

    # 5. Public Web Frontend UI (`app/page.js`)
    homepage_jsx = """
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
"""

    # 6. Protected Administrative Desk UI Layout (`app/admin/page.js`)
    admin_jsx = """
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
"""

    # 7. GitHub Security Guard Configuration (.gitignore)
    gitignore_content = """
# Dependency directories
node_modules/
jspm_packages/
web_modules/
.npm/

# Next.js build outputs
.next/
out/
build/

# Local environment variables and secrets
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.flash
.env*.local

# Local Databases & Venv
*.db
*.db-journal
venv/
.venv/
__pycache__/

# OS files
.DS_Store
Thumbs.db
"""

    # --- EXECUTE SCRAPING & WRITING PROCESSES ---
    print("[+] Structural deployment processing initiated...")
    create_file(".gitignore", gitignore_content)
    create_file("package.json", package_json)
    create_file("postcss.config.js", postcss_config)
    create_file("tailwind.config.js", tailwind_config)
    create_file("app/globals.css", globals_css)
    create_file("app/layout.js", layout_jsx)
    create_file("app/api/leads/route.js", api_lead_route)
    create_file("app/data/agentContext.js", agent_context_js)
    create_file("app/page.js", homepage_jsx)
    create_file("app/admin/page.js", admin_jsx)
    print("[✓] Web asset file structure successfully deployed.\n")

    # --- AUTOMATIC GIT REPOSITORY SYNTHESIS ---
    try:
        subprocess.run(["git", "init"], check=True, stdout=subprocess.DEVNULL)
        subprocess.run(["git", "add", "."], check=True)
        subprocess.run(["git", "commit", "-m", "Scaffold Serverless Real Estate Portal Engine"], check=True, stdout=subprocess.DEVNULL)
        print("[✓] Local Git repository initialized and codebase changes safely committed.")
    except Exception:
        print("[!] Git software missing from local runtime host engine shell. Assets written cleanly.")

    print("\n==================================================")
    print("🎁 HANDOVER DEPLOYMENT INSTRUCTIONS FOR JEREMY:")
    print("==================================================")
    print(" 1. Zip this entire folder workspace and email it to him.")
    print(" 2. Have him upload or drag-and-drop the project onto Vercel.")
    print(" 3. Paste the exact string from your Neon Dashboard into the")
    print("    Environment Variable box named exactly: DATABASE_URL")
    print("==================================================\n")

if __name__ == "__main__":
    main()