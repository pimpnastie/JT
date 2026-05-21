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