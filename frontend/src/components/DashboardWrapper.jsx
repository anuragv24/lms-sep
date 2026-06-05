'use client';

import React, { useState } from 'react';
import { Menu, Library, X } from 'lucide-react';
import Sidebar from './Sidebar';
import ProfileDropdown from './ProfileDropdown'; 

export default function DashboardWrapper({ children, currentUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-zinc-900 text-zinc-100 overflow-hidden relative">

      <Sidebar currentUser={currentUser} />

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm transition-opacity duration-200">
          <div className="w-64 h-full relative z-50 animate-in slide-in-from-left duration-200">
            
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-4 p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-900 rounded-lg border border-zinc-800 focus:outline-none transition-colors"
            >
              <X size={16} />
            </button>
            
            <div onClick={() => setMobileMenuOpen(false)} className="h-full">
              <Sidebar currentUser={currentUser} isMobile={true} />
            </div>

          </div>
          
          <div
            className="absolute inset-0 w-full h-full"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="w-full bg-zinc-950/50 backdrop-blur-md border-b border-zinc-800/80 sm:px-6 md:px-8 py-3 flex items-center justify-between shadow-md z-40">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors border border-zinc-800 focus:outline-none"
            >
              <Menu size={18} />
            </button>

            <div className="flex md:hidden items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white">
              <Library size={14} className="stroke-[2.5]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-100">
              Library
            </span>
          </div>
          <div className="hidden md:block">
              <h2 className="text-xs font-semibold text-zinc-400">
                Welcome back, <span className="text-zinc-100 font-bold">{currentUser?.name?.split(' ')[0] || "Reader"}</span> 
              </h2>
            </div>
            </div>

            <div className="flex items-center gap-4">
            <ProfileDropdown currentUser={currentUser} />
          </div>

        </header>

        <div className="flex-1 overflow-y-auto focus:outline-none">
          <main className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}