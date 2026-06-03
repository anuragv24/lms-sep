import React from 'react';
import BookCard from '@/components/BookCard';
import { Bookmark as BookmarkIcon, FolderHeart } from 'lucide-react';
import { getAuthenticatedUser } from '@/api/user'; 
import { getBookmarkedVolumes } from '@/api/bookmarks'; 
import { cookies } from 'next/headers';

export default async function BookmarksPage() {
  const user = await getAuthenticatedUser();

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || "";

  const result = await getBookmarkedVolumes(token);

  const errorState = !result.success;
  const bookmarkedVolumes = result.bookmarkedVolumes || [];

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-zinc-800/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <BookmarkIcon className="text-violet-500 fill-violet-500/10 stroke-[2]" size={24} />
            My Saved Bookmarks
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Your curated collection of literature references and library books.
          </p>
        </div>
        {!errorState && (
          <div className="text-xs px-3 py-1.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-400 font-mono self-start md:self-auto">
            Total Saved: {bookmarkedVolumes.length}
          </div>
        )}
      </div>

      {errorState ? (
        <p className="text-xs text-red-400 font-mono">System failed, Please try again later.</p>
      ) : bookmarkedVolumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {bookmarkedVolumes.map((book) => (
            <BookCard
              key={book._id} 
              book={book}    
              isBookmarked={true} 
              currentUser={user}
              token={token}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-zinc-950/20 rounded-3xl border border-zinc-800/40 border-dashed max-w-md mx-auto mt-12">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-zinc-600 border border-zinc-800 mb-4">
            <FolderHeart size={20} className="stroke-[1.5]" />
          </div>
          <h3 className="font-bold text-zinc-200 text-sm">Your vault is empty</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-[260px] leading-relaxed">
            You haven't saved any books yet. Explore the main library page and tap the bookmark ribbon icon on any card volume to pin it here.
          </p>
        </div>
      )}

    </div>
  );
}