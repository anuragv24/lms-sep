import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyAuth";
import { v2 as cloudinary } from "cloudinary";
import Book from "@/models/Book";

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const corsHeaders = {
  'Access-Control-Allow-Origin':  process.env.FRONTEND_URL || 'http://localhost:3000',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  try {
    // 2. Authenticate the admin user
    const user = verifyToken(req);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: "Unauthorized administrative access." },
        { status: 401, headers: corsHeaders }
      );
    }

    // 3. Extract data from multipart form stream
    const formData = await req.formData();
    const title = formData.get("title");
    const author = formData.get("author");
    const description = formData.get("description") || "";
    const file = formData.get("bookPdf");
    const thumbnail = formData.get("thumbnail");

    if (!title || !author) {
      return NextResponse.json(
        { success: false, message: "Title and Author inputs are required fields." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400, headers: corsHeaders }
      );
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; 
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        success: false, 
        message: `File size exceeds the allowable 10MB structural limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.` 
      }, { status: 400, headers: corsHeaders });
    }

    // 4. Convert PDF file to buffer stream for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "books",
          format: "pdf",
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    if (!uploadResult || !uploadResult.secure_url) {
      return NextResponse.json(
        { success: false, message: "Book asset upload to cloud failed." },
        { status: 500, headers: corsHeaders }
      );
    }

    // 5. Convert & upload thumbnail if present
    let thumbnailUrl = null;
    if (thumbnail && thumbnail.size > 0) {
      const imgArrayBuffer = await thumbnail.arrayBuffer();
      const imgBuffer = Buffer.from(imgArrayBuffer);

      const thumbnailUploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "book_covers",
          }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(imgBuffer);
      });

      if (thumbnailUploadResult && thumbnailUploadResult.secure_url) {
        thumbnailUrl = thumbnailUploadResult.secure_url;
      }
    }

    // 6. Persist database record on Port 5000
    await connectDB();
    const newBook = await Book.create({
      title: title.trim(),
      author: author.trim(),
      description: description?.trim() || "", 
      pdfUrl: uploadResult.secure_url,
      thumbnailUrl: thumbnailUrl // Standardized mapping name to match your BookCard properties
    });

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        id: newBook._id.toString(),
        url: uploadResult.secure_url,
      }
    }, { status: 201, headers: corsHeaders });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "File upload operation encountered a fatal system error." },
      { status: 500, headers: corsHeaders }
    );
  }
}