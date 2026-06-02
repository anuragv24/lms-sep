"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Compass, Bookmark, ShieldAlert, Library, User } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton"; 

export default function Sidebar({ currentUser, isMobile = false }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Explore Books", path: "/books", icon: Compass },
    { label: "My Bookmarks", path: "/bookmarks", icon: Bookmark },
  ];

  return (
    <aside className={`${isMobile ? "flex" : "hidden md:flex"} flex-col w-64 h-screen bg-zinc-950 border-r border-zinc-800 p-5 text-zinc-200 shrink-0`}>
      
      <div className="flex items-center gap-3 px-2 py-4 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
          <Library size={18} className="stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Library
          </h1>
          
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-none">
        <span className="block px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
          Discover
        </span>

        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const IconComponent = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-zinc-900 text-violet-400 border border-zinc-800/80 shadow-inner"
                  : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
              }`}
            >
              <IconComponent
                size={18}
                className={`transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? "text-violet-400 stroke-[2.5]" : "text-zinc-400 stroke-[2]"
                }`}
              />
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-md shadow-violet-500" />
              )}
            </Link>
          );
        })}

        {currentUser?.role === "admin" && (
          <div className="pt-6 mt-6 border-t border-zinc-900 space-y-1.5">
            <span className="block px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
              Management
            </span>
            <Link
              href="/admin-upload" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                pathname === "/admin-upload"
                  ? "bg-zinc-900 text-fuchsia-400 border border-zinc-800/80"
                  : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
              }`}
            >
              <ShieldAlert
                size={18}
                className={
                  pathname === "/admin-upload"
                    ? "text-fuchsia-400 stroke-[2.5]"
                    : "text-zinc-400 stroke-[2]"
                }
              />
              Admin Control
            </Link>
          </div>
        )}
      </nav>

  
      <div className="pt-4 border-t border-zinc-900 mt-auto relative group/footer min-h-[64px] flex items-center">
        
        <div className="flex items-center gap-3 px-2 w-full transition-all duration-300 group-hover/footer:opacity-0 group-hover/footer:translate-y-2 pointer-events-auto group-hover/footer:pointer-events-none">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shadow-md">
            <User size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-zinc-200 truncate">
              {currentUser?.name || "Reader Account"}
            </p>
            
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 top-4 opacity-0 translate-y-[-8px] transition-all duration-300 group-hover/footer:opacity-100 group-hover/footer:translate-y-0 pointer-events-none group-hover/footer:pointer-events-auto">
          <LogoutButton />
        </div>

      </div>

    </aside>
  );
}