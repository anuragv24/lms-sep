// app/layout.js
import React from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'Library',
  description: 'Modern Role-Based Library Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark selection:bg-violet-500/30 selection:text-violet-200">
      <body className="bg-zinc-900 text-zinc-100 antialiased min-h-screen font-sans">
        
        {children}
        
      </body>
    </html>
  );
}