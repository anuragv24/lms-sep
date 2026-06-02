import { connectDB } from "@/lib/db";
import Bookmark from "@/models/Bookmark";
import Book from "@/models/Book";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyAuth";

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:3000',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(req) {
  try {
    await connectDB();

    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in to see bookmarks." },
        { status: 401, headers: corsHeaders }
      );
    }

    let bookmarkedVolumes = [];

    const userBookmarks = await Bookmark.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .lean();

    if (userBookmarks.length > 0) {
      const bookIds = userBookmarks.map((b) => b.bookId);

      const booksData = await Book.find({ _id: { $in: bookIds } }).lean();

      bookmarkedVolumes = userBookmarks
        .map((b) => booksData.find((book) => book._id.toString() === b.bookId.toString()))
        .filter(Boolean);
    }

    return NextResponse.json(
      { success: true, bookmarkedVolumes },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("BOOKMARKS_FETCH_FAILURE:", error);
    return NextResponse.json(
      { success: false, message: "Internal server failure while gathering bookmarks." },
      { status: 500, headers: corsHeaders }
    );
  }
}