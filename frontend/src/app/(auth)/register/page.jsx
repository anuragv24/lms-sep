"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Lock,
  Mail,
  User,
  Library,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { registerUser } from "@/api/auth";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await registerUser(name, email, password);

    setLoading(false);
    if (!result.success) {
      setError(result.message);
    } else {
      router.push("/login?registered=true");
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20 mb-4">
            <Library size={22} className="stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Create Your Account
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5">
            Join to explore the large collections of books
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-950/20 border border-red-900/40 rounded-xl flex items-center gap-3 text-xs text-red-200 animate-in shake duration-200">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block pl-1">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-violet-400 transition-colors duration-200">
                <User size={16} />
              </div>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter your full name..."
                className="w-full pl-11 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-violet-500/60 focus:bg-zinc-950 focus:ring-4 focus:ring-violet-500/5 transition-all duration-200"
              />
            </div>
          </div>

          
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block pl-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-violet-400 transition-colors duration-200">
                <Mail size={16} />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email..."
                className="w-full pl-11 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-violet-500/60 focus:bg-zinc-950 focus:ring-4 focus:ring-violet-500/5 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block pl-1">
              Secure Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-violet-400 transition-colors duration-200">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Enter your password..."
                className="w-full pl-11 pr-12 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-violet-500/60 focus:bg-zinc-950 focus:ring-4 focus:ring-violet-500/5 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-500">
            Already have an active account?{" "}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 font-medium underline underline-offset-4 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
