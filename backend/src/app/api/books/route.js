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

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search") || "";

    const decodedUser = verifyToken(req);

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

    let bookmarkedIdList = [];
    if (decodedUser?.id) {
      const userBookmarks = await Bookmark.find({ userId: decodedUser.id }).lean();
      
      bookmarkedIdList = userBookmarks.map(b => b.bookId.toString());
    }

    return NextResponse.json({
      success: true,
      books,
      bookmarkedIdList 
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error("CRASH: Backend books API failed:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Unable to retrieve book listings from the database."
    }, { status: 500, headers: corsHeaders });
  }
}