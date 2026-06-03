import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Library, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getSingleBook } from '@/api/books';
import { cookies } from 'next/headers';

export default async function ProtectedPDFReaderPage({ params }) {
  const resolvedParams = await params;
  const { bookId } = resolvedParams;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || "";
  const result = await getSingleBook(bookId, token);

  if (!result.success) {
    if (result.status === 404) {
      return notFound();
    }
    
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200 p-6">
        <p className="text-sm font-mono text-red-400">Failed to stream document data nodes securely.</p>
        <p className="text-xs text-zinc-500 mt-1">{result.message}</p>
        <Link href="/books" className="mt-4 text-xs font-semibold text-violet-400 underline">Return to Library</Link>
      </div>
    );
  }

  const book = result.book;
  const secureStreamUrl = `${book.pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`;

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden select-none">
      
      <header className="h-16 w-full bg-zinc-900 border-b border-zinc-800/80 px-4 md:px-6 flex items-center justify-between shrink-0 shadow-md relative z-10">
        
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/books"
            className="p-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center shrink-0"
            title="Exit Reader Workspace"
          >
            <ArrowLeft size={16} />
          </Link>
          
          <div className="min-w-0">
            <h1 className="font-bold text-sm tracking-tight text-zinc-100 truncate max-w-[240px] sm:max-w-md">
              {book.title}
            </h1>
            <p className="text-[11px] text-zinc-400 font-medium truncate max-w-[200px] sm:max-w-xs mt-0.5">
              By {book.author}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-mono text-zinc-400">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>SSL Stream Guard</span>
          </div>
          
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Library size={14} className="stroke-[2.5]" />
          </div>
        </div>

      </header>

      <div className="flex-1 w-full h-full bg-zinc-900 relative">
        
        <object
          data={secureStreamUrl}
          type="application/pdf"
          className="w-full h-full border-none shadow-2xl relative z-10"
        >
          <iframe
            src={secureStreamUrl}
            className="w-full h-full border-none absolute inset-0 z-10"
            title={book.title}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-center p-6 z-0">
            <p className="text-xs text-zinc-400">Your browser canvas does not support direct PDF viewing frameworks.</p>
            <a href={book.pdfUrl} target="_blank" rel="noreferrer" className="text-xs text-violet-400 underline mt-2">Open streaming layout link directly</a>
          </div>
        </object>

      </div>

    </div>
  );
}