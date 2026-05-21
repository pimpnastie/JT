import './globals.css';

export const metadata = {
  title: 'The Thieroff Team | Coldwell Banker Realty Pittsburgh',
  description: 'Expert residential insights and property listings across Bellevue, Ross Township, Avalon, and the Greater North Hills market.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#f8fafc] text-slate-900 antialiased">{children}</body>
    </html>
  );
}