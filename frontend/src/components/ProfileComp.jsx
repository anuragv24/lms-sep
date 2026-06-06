"use client"

import React, { useRef, useState } from 'react';
import { User, ShieldCheck, Key, RefreshCw, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { updateUser } from '@/api/updateUser';
import { useRouter } from 'next/navigation';

export default function ProfileComp({currentUser, token}){
    if (!currentUser) {
    return (
      <div className="p-4 bg-rose-950/20 border border-rose-800/50 rounded-xl text-rose-400 text-xs">
        Failed to resolve session. Please log in again.
      </div>
    );
  }

  const [name, setName] = useState(currentUser.name || '');
  const [profilePic, setProfilePic] = useState(currentUser.profilePic || '');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const router = useRouter()
  const fileInputRef = useRef(null);

  const isGoogleUserWithoutPassword = currentUser.authProvider === 'google' && !currentUser.hasPassword;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMsg({ type: 'error', text: 'Please select a valid image file.' });
      return;
    }

    setSelectedFile(file);
    setProfilePic(URL.createObjectURL(file)); 
  };



  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match.' });
      setLoading(false);
      return;
    }

    try {

      const dataToUpdate = {
        name: name,
        profilePic: selectedFile,
        currentPassword: currentPassword,
        newPassword: newPassword
      }

     
      const data = await updateUser(dataToUpdate, token)

      if (!data.success) {
        throw new Error(data.message || 'Something went wrong');
      }

      setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
      router.refresh();
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setStatusMsg({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">Account Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">Manage your public profile attributes and security configurations.</p>
      </div>

      {statusMsg.text && (
        <div className={`p-4 rounded-xl flex items-start gap-3 border ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400' 
            : 'bg-rose-950/30 border-rose-800/50 text-rose-400'
        } animate-in fade-in slide-in-from-top-1 duration-200`}>
          {statusMsg.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
          <span className="text-xs font-medium">{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        
        {/* PUBLIC INTERFACE PROFILE CONFIGURATION */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
            <User size={16} className="text-violet-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Personal Details</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative group w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 text-xl font-bold overflow-hidden shadow-inner">
                {profilePic ? (
                  <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              <div className="absolute inset-0 bg-zinc-950/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <Camera size={16} className="text-zinc-200" />
              </div>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl focus:outline-none focus:border-violet-500 text-zinc-200 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full text-xs px-3.5 py-2.5 bg-zinc-900/20 border border-zinc-800/50 text-zinc-500 rounded-xl cursor-not-allowed select-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* DYNAMIC AUTHENTICATION & PASSWORD MANAGEMENT */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
            <Key size={16} className="text-fuchsia-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Security & Credentials</h2>
          </div>

          {isGoogleUserWithoutPassword ? (
            /* STATE A: Google User setting up their security details for the first time */
            <div className="space-y-4">
              <div className="p-3.5 bg-violet-950/20 border border-violet-900/40 rounded-xl">
                <p className="text-xs text-violet-300 leading-relaxed">
                  <strong>Link Password Login:</strong> Your account currently uses Google Sign-In exclusively. Creating a secondary credential password allows you to log in manually using your email address and password whenever you choose.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Set Account Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl focus:outline-none focus:border-fuchsia-500 text-zinc-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl focus:outline-none focus:border-fuchsia-500 text-zinc-200"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* STATE B: Local/Hybrid Users who already possess standard password hashes */
            <div className="space-y-4">
              {currentUser.authProvider === 'google' && (
                <div className="p-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2 w-fit">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span className="text-[11px] font-medium text-zinc-400">Linked to Google Sign-In</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full sm:w-1/2 block text-xs px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl focus:outline-none focus:border-fuchsia-500 text-zinc-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl focus:outline-none focus:border-fuchsia-500 text-zinc-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl focus:outline-none focus:border-fuchsia-500 text-zinc-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-600/10 focus:outline-none disabled:opacity-50 transition-all"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : 'Save Modifications'}
          </button>
        </div>

      </form>
    </div>
  );
}