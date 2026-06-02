import { connectDB } from "@/lib/db";
import Bookmark from "@/models/Bookmark";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyAuth";

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:3000',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  try {
    await connectDB();

    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication failed. Access denied." },
        { status: 401, headers: corsHeaders }
      );
    }

    const { bookId } = await req.json();
    if (!bookId) {
      return NextResponse.json(
        { success: false, message: "Missing required parameter: bookId" },
        { status: 400, headers: corsHeaders }
      );
    }

    const existingBookmark = await Bookmark.findOne({
      userId: user.id,
      bookId: bookId,
    });

    let message = "";
    if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      message = "Bookmark removed successfully.";
    } else {
      await Bookmark.create({
        userId: user.id,
        bookId: bookId,
      });
      message = "Bookmark added successfully.";
    }

    return NextResponse.json(
      { success: true, message },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("BOOKMARK_TOGGLE_FAILURE:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update database bookmark node." },
      { status: 500, headers: corsHeaders }
    );
  }
}