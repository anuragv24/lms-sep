"'use client';"

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";


const firebaseConfig={
    apiKey:process.env.NEXT_PUBLIC_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECTID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export default function GoogleAuthButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      
      const firebaseIdToken = await result.user.getIdToken();

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {}, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${firebaseIdToken}` 
        }
      });
      if (response.data.success ) {
        const token = response.data.token;
        document.cookie = `accessToken=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax; Secure`;
        localStorage.setItem("appToken", token);
        window.location.href = "/books";
      } else {
          alert(response.data.message || "Google Sign-In dropped.");      
        }
      
    } catch (error) {
      console.error("Authentication Error:", error);
      alert("Sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleGoogleLogin} 
      disabled={isLoading}
      type="button"
      className="flex w-full items-center justify-center gap-2 mt-4 px-5 py-3 border border-neutral-700 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition disabled:opacity-50"
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            fill="#EA4335"
          />
        </svg>
      )}
      <span>{isLoading ? "Connecting..." : "Continue with Google"}</span>
    </button>
  );
}