import { getBooksAndBookmarks } from "@/api/books";
import { getAuthenticatedUser } from "@/api/user";
import BookCard from "@/components/BookCard";
import { Search, Compass, BookX, AlertTriangle, RefreshCw } from "lucide-react";
import { cookies } from "next/headers";

export default async function Books({ searchParams }) {
  const params = await searchParams;
  const searchQuery = params.search || "";

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || "";

  const user = await getAuthenticatedUser();

  const result = await getBooksAndBookmarks(searchQuery, token);

  const databaseError = !result.success;
  const errorMessage = result.message || "";
  const books = result.books || [];
  const bookmarkedIdSet = result.bookmarkedIdSet || new Set();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-zinc-800/60 pb-6  ">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <Compass className="text-violet-500 stroke-[2]" size={24} />
            Explore Library
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Browse across our collection of books or search for selective text
            titles.
          </p>
        </div>
        {!databaseError && (
          <div className="text-xs px-3 py-1.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-400 font-mono self-start md:self-auto">
            Total Items: {books.length}
          </div>
        )}
      </div>

      <form method="GET" action="/books" className="relative max-w-2xl group">
        <div className="absolute inset-y-0 z-10 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-violet-400 transition-colors duration-200">
          <Search size={18} />
        </div>
        <input
          type="text"
          name="search"
          defaultValue={searchQuery}
          disabled={databaseError}
          placeholder={
            databaseError
              ? "Search disabled due to Error"
              : "Search for title or author..."
          }
          className="w-full pl-12 pr-24 py-3.5 bg-zinc-950/40 backdrop-blur-md border border-zinc-800 rounded-2xl text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500/60 focus:bg-zinc-950/80 focus:ring-4 focus:ring-violet-500/5 transition-all duration-300 shadow-xl"
        />
        <button
          type="submit"
          className="absolute right-2.5 top-2.5 px-4 py-1.5 bg-zinc-900 hover:bg-violet-600 border border-zinc-800 hover:border-violet-500 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-md"
        >
          Search
        </button>
      </form>

      {databaseError ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-red-950/10 rounded-3xl border border-red-900/30 max-w-lg mx-auto mt-8 shadow-xl shadow-red-950/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-red-950/60 flex items-center justify-center text-red-400 border border-red-800/50 mb-5 shadow-lg shadow-red-950">
            <AlertTriangle size={24} className="stroke-[2]" />
          </div>
          <h3 className="font-bold text-red-200 text-base tracking-tight">
            Library Core Connectivity Failure
          </h3>
          <p className="text-xs text-zinc-400 mt-2 max-w-sm leading-relaxed">
            Our data servers are currently refusing requests or undergoing
            routine maintenance. Rest assured, your library records are secure.
          </p>
          <div className="mt-4 p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 w-full max-w-xs text-[10px] font-mono text-zinc-500 truncate">
            Error Stack: {errorMessage}
          </div>
          <a
            href="/books"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl transition-all duration-200 shadow-md active:scale-95"
          >
            <RefreshCw size={12} />
            Retry System Hook
          </a>
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              isBookmarked={bookmarkedIdSet.has(book._id)}
              currentUser={user}
              token={token}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-zinc-950/20 rounded-3xl border border-zinc-800/40 border-dashed max-w-md mx-auto mt-8">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-zinc-600 border border-zinc-800 mb-4">
            <BookX size={20} className="stroke-[1.5]" />
          </div>
          <h3 className="font-bold text-zinc-200 text-sm">
            No match catalog matches
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-[260px] leading-relaxed">
            We couldn't find anything matching "{searchQuery}". Double check
            your spellings or clear search parameters.
          </p>
        </div>
      )}
    </div>
  );
}
