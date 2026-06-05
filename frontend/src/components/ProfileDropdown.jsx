"use client";

import { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { User, Settings, Shield, LogOut, Key } from 'lucide-react';
import LogoutButton from "./LogoutButton";


export default function ProfileDropdown({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const firstLetter = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'R';
  const hasAvatar = !!currentUser?.profilePic;

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all focus:outline-none"
      >
        {hasAvatar ? (
          <img
            src={currentUser.profilePic}
            alt={currentUser.name}
            className="w-8 h-8 rounded-lg object-cover border border-zinc-700"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-violet-500/10">
            {firstLetter}
          </div>
        )}
        <span className="hidden sm:inline text-xs font-medium text-zinc-300 max-w-[100px] truncate">
          {currentUser?.name || "Reader"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* user info */}
          <div className="px-4 py-3 border-b border-zinc-900">
            <p className="text-sm font-semibold text-zinc-100 truncate">
              {currentUser?.name || "Reader Account"}
            </p>
            <p className="text-xs text-zinc-500 truncate mt-0.5">
              {currentUser?.email}
            </p>
          </div>

          <div className="p-1 space-y-0.5">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors group"
            >
              <Settings size={14} className="text-zinc-500 group-hover:text-violet-400 transition-colors" />
              Account Settings
            </Link>
            {currentUser?.role === 'admin' && (
              <Link
                href="/admin-upload"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors group"
              >
                <Shield size={14} className="text-zinc-500 group-hover:text-fuchsia-400 transition-colors" />
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="border-t border-zinc-900 p-1 mt-1">
            <div onClick={() => setIsOpen(false)} className="w-full">
              <LogoutButton />
            </div>
          </div>


        </div>
      )}
    </div>
  );
}
