"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlusCircle, FileText, User, Type, FileUp, Loader2, CheckCircle2, AlertCircle, Image } from "lucide-react";
import { uploadBook } from "@/api/books"; 

export default function UploadComp({token}) {
  const [loading, setLoading] = useState(false); 
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleFormSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadedUrl(null);

    const formData = new FormData(e.target);

    const result = await uploadBook(formData, token);

    setLoading(false);
    if (result.success && result.data && result.data.id) {
      setUploadedUrl(result.data.id);
      e.target.reset();
    } else {
      setError(result.message || "Upload failed");
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="border-b border-zinc-800/60 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2.5">
          <PlusCircle className="text-fuchsia-500 stroke-[2]" size={24} />
          Add new book
        </h1>
      </div>

      {uploadedUrl && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-200 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>
              Book successfully uploaded !!!
            </span>
          </div>
          <button
            onClick={() => router.push(`/reader/${uploadedUrl}`)}
            className="px-3 py-1 bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/50 rounded-lg text-emerald-300 font-medium transition-colors"
          >
            Click here to view
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl flex items-center gap-3 text-xs text-red-200 animate-in shake duration-200">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleFormSubmit}
        className="space-y-6 bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 p-6 sm:p-8 rounded-3xl shadow-xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block pl-1">
              Book Title *
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-fuchsia-400 transition-colors duration-200">
                <Type size={16} />
              </div>
              <input
                type="text"
                name="title"
                required
                className="w-full pl-11 pr-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-fuchsia-500/60 focus:bg-zinc-950 focus:ring-4 focus:ring-fuchsia-500/5 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block pl-1">
              Author Name *
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-fuchsia-400 transition-colors duration-200">
                <User size={16} />
              </div>
              <input
                type="text"
                name="author"
                required
                className="w-full pl-11 pr-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-fuchsia-500/60 focus:bg-zinc-950 focus:ring-4 focus:ring-fuchsia-500/5 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block pl-1">
            Synopsis / Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-fuchsia-500/60 focus:bg-zinc-950 focus:ring-4 focus:ring-fuchsia-500/5 transition-all duration-200 resize-none leading-relaxed"
          />
        </div>

        <div className="h-px bg-zinc-900 my-2" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block pl-1">
              Select Book PDF Asset *
            </label>
            <div className="relative group flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-zinc-800 border-dashed rounded-xl cursor-pointer bg-zinc-950/30 hover:bg-zinc-950/60 hover:border-fuchsia-500/40 transition-all duration-200">
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <FileText size={20} className="text-zinc-500 group-hover:text-fuchsia-400 mb-1.5 transition-colors" />
                  <span className="text-xs text-zinc-400 font-medium block">
                    Click to add a book <span className=" text-red-200">(Max size: 10MB)</span>
                  </span>
                </div>
                <input
                  type="file"
                  name="bookPdf"
                  accept=".pdf"
                  required
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    const nameDisplay = e.target.parentElement?.querySelector("span");
                    if (!file) return;

                    const MAX_FILE_SIZE = 10 * 1024 * 1024;
                    if (file.size > MAX_FILE_SIZE) {
                      setError(`File is too large! Max allowed size is 10MB. Selected file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
                      e.target.value = ""; 
                      if (nameDisplay) nameDisplay.textContent = "Click to add a book ";
                      return;
                    }

                    setError(null);
                    if (nameDisplay) {
                      nameDisplay.textContent = `Attached: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`;
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block pl-1">
              Cover Image
            </label>
            <div className="relative group flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-zinc-800 border-dashed rounded-xl cursor-pointer bg-zinc-950/30 hover:bg-zinc-950/60 hover:border-violet-500/40 transition-all duration-200">
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <Image size={20} className="text-zinc-500 group-hover:text-fuchsia-400 mb-1.5 transition-colors" />
                  <span className="text-xs text-zinc-400 font-medium block">Click to attach cover</span>
                </div>
                <input 
                  type="file" 
                  name="thumbnail" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    const nameDisplay = e.target.parentElement?.querySelector('span:last-child');
                    if (file && nameDisplay) {
                      nameDisplay.textContent = `Attached Image: ${file.name}`;
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-fuchsia-500/10 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileUp size={16} />
                Upload Book
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}