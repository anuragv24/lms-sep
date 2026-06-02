"use client"

import { LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logoutUser } from '@/api/auth';


export default  function LogoutButton({ isMobile = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    const result = await logoutUser();

    setLoading(false);

    if (result.success) {
      router.refresh();
      router.push("/login");
    } else {
      alert(result.message);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/10 border border-transparent hover:border-red-900/20 rounded-xl transition-all duration-200 disabled:opacity-40 group focus:outline-none ${
        isMobile ? 'mt-auto' : ''
      }`}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin text-red-400" />
      ) : (
        <LogOut size={18} className="text-zinc-500 group-hover:text-red-400 transition-colors" />
      )}
      <span>{loading ? 'Signing Out...' : 'Sign Out'}</span>
    </button>
  );
}