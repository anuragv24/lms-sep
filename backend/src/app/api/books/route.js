import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import Bookmark from "@/models/Bookmark";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyAuth";

const corsHeaders = {
  'Access-Control-Allow-Origin':  process.env.FRONTEND_URL || 'http://localhost:3000',
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

    // 1. Parse the search parameter from the URL string
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search") || "";

    // 2. Optional: Identify the user if they passed a Bearer Token
    const decodedUser = verifyToken(req);

    // 3. Execute Book Query
    let books = [];
    if (searchQuery) {
      books = await Book.find(
        { $text: { $search: searchQuery } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .lean();
    } else {
      books = await Book.find({}).sort({ createdAt: -1 }).lean();
    }

    // 4. Execute Bookmark Query if user is authenticated
    let bookmarkedIdList = [];
    if (decodedUser?.id) {
      const userBookmarks = await Bookmark.find({ userId: decodedUser.id }).lean();
      
      bookmarkedIdList = userBookmarks.map(b => b.bookId.toString());
    }

    // 5. Send back the unified payload
    return NextResponse.json({
      success: true,
      books,
      bookmarkedIdList // Send as an array; frontend can convert back to a Set
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error("CRASH: Backend books API failed:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Unable to retrieve book listings from the database."
    }, { status: 500, headers: corsHeaders });
  }
}