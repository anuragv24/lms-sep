import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import Bookmark from "@/models/Bookmark";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyAuth";

const corsHeaders = {
  'Access-Control-Allow-Origin':  process.env.FRONTEND_URL || 'http://localhost:3000',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle browser preflight checks
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// The core DELETE method
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    // 1. Authenticate the user calling the endpoint
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication failed. Access denied." },
        { status: 401, headers: corsHeaders }
      );
    }

    // 2. Strict Role Check: Only let admins perform deletions
    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Only administrators can delete assets." },
        { status: 403, headers: corsHeaders }
      );
    }

    // 3. Extract the book ID from the dynamic URL params wrapper
    // In Next.js App Router, dynamic segments must be awaited if using newer versions,
    // but destructuring them directly or awaiting is safe practice.
    const resolvedParams = await params;
    const bookId = resolvedParams.id;

    if (!bookId) {
      return NextResponse.json(
        { success: false, message: "Invalid Request: Missing Book ID parameter." },
        { status: 400, headers: corsHeaders }
      );
    }

    // 4. Perform the deletion cascade
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return NextResponse.json(
        { success: false, message: "The requested book volume does not exist or was already removed." },
        { status: 404, headers: corsHeaders }
      );
    }

    // Clean up any stray bookmarks pointing to the deleted book
    await Bookmark.deleteMany({ bookId: bookId });

    return NextResponse.json(
      { success: true, message: `Successfully deleted "${deletedBook.title}" from the registry.` },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("CRASH: Backend book deletion failed:", error);
    return NextResponse.json(
      { success: false, message: "Internal server failure while dropping book item node." },
      { status: 500, headers: corsHeaders }
    );
  }
}


export async function GET(req, { params }) {
  try {
    await connectDB();

    // 1. Authenticate the reading user via their Bearer passport token
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication failed. Access denied." },
        { status: 401, headers: corsHeaders }
      );
    }

    // 2. Resolve dynamic parameters to pull the book ID from URL context
    const resolvedParams = await params;
    const bookId = resolvedParams.id;

    if (!bookId) {
      return NextResponse.json(
        { success: false, message: "Missing required identifier segment." },
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Query the single book resource document
    const book = await Book.findById(bookId).lean();

    if (!book) {
      return NextResponse.json(
        { success: false, message: "The requested text volume could not be found." },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, book },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("READER_CANVAS_BACKEND_LOAD_CRASH:", error);
    return NextResponse.json(
      { success: false, message: "Internal systems failure loading digital canvas data stream." },
      { status: 500, headers: corsHeaders }
    );
  }
}