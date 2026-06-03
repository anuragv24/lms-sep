"use client";

import React, { useState } from "react"; 
import { Trash2, Loader2, Bookmark, BookOpen, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toggleBookmark } from "@/api/bookmarks"; 
import { deleteBook } from "@/api/books";         

export default function BookCard({
  book,
  isBookmarked,
  currentUser,
  token
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const isAdmin = currentUser?.role === "admin";
  const { _id, title, author, description } = book;
  
  
  async function handleDeleteClick(e) {
    e.preventDefault(); 
    e.stopPropagation();

    if (confirm(`Are you absolutely sure you want to permanently delete "${title}"?`)) {
      setIsDeleting(true);
      
      
      const result = await deleteBook(_id, token);
      
      if (!result.success) {
        alert(result.message);
        setIsDeleting(false);
      } else {
        router.refresh(); 
      }
    }
  }

  async function handleBookmarkClick(e) {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to manage your bookmarks.");
      return;
    }

    setIsBookmarking(true);
    console.log("token from bookcard :: ", token)

    const result = await toggleBookmark(_id, token);

    if (result.success) {
      router.refresh(); 
    } else {
      alert(result.message);
    }
    setIsBookmarking(false);
  }

  return (
    <div className={`group relative flex flex-col w-full bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 overflow-hidden hover:border-violet-500/50 hover:bg-zinc-950/80 transition-all duration-300 shadow-xl hover:shadow-violet-500/5 ${
      isDeleting ? "opacity-20 scale-95 pointer-events-none" : ""
    }`}>
      
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center overflow-hidden border-b border-zinc-800/60 group-hover:from-zinc-900 group-hover:to-zinc-800/40 transition-colors duration-300">
        {book.thumbnailUrl ? (
          <img
            src={book.thumbnailUrl}
            alt={`${title} Cover`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all duration-300" />
            <BookOpen
              size={48}
              className="text-zinc-700 group-hover:text-violet-400/80 transition-all duration-300 group-hover:scale-110 stroke-[1.5]"
            />
          </div>
        )}

        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          
          {isAdmin ? (
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="p-2.5 rounded-xl border border-zinc-800 text-zinc-400 bg-zinc-900/80 backdrop-blur-md hover:text-red-400 hover:border-red-500/40 transition-all duration-200 active:scale-95 cursor-pointer "
              title="Permanently Delete Book"
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin text-red-400" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          ) : null}

          <button
            onClick={handleBookmarkClick}
            disabled={isBookmarking}
            className={`p-2.5 rounded-xl border transition-all duration-200 active:scale-95 ${
              isBookmarked
                ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/30"
                : "bg-zinc-900/80 backdrop-blur-md border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Book"}
          >
            {isBookmarking ? (
              <Loader2 size={16} className="animate-spin text-zinc-400" />
            ) : (
              <Bookmark
                size={16}
                className={isBookmarked ? "fill-current stroke-[2.5]" : "stroke-[2]"}
              />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 mb-2">
          <User size={12} className="text-violet-400/80" />
          <span className="truncate max-w-[180px]">{author}</span>
        </div>

        <h3 className="font-bold text-zinc-100 text-base tracking-tight mb-1.5 line-clamp-1 group-hover:text-violet-400 transition-colors duration-200">
          {title}
        </h3>

        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-6">
          {description || "No description provided for this catalog volume."}
        </p>

        <div className="mt-auto pt-3 border-t border-zinc-900 flex items-center justify-between">
          <Link
            href={`/reader/${_id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-900 hover:bg-violet-600 border border-zinc-800 hover:border-violet-500 text-zinc-200 hover:text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-md active:scale-[0.98]"
          >
            <BookOpen size={14} />
            Start Reading
          </Link>
        </div>
      </div>

    </div>
  );
}