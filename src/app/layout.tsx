import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scholarship OS — Personal Scholarship CRM & Command Center',
  description: 'Private scholarship application management system, deadline tracker, document library, and personal gap-year operating system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased light">
      <head>
        <meta name="theme-color" content="#F8F9FA" />
      </head>
      <body className="h-full bg-[#F8F9FA] text-[#0F172A] font-sans overflow-hidden">
        {children}
      </body>
    </html>
  );
}
