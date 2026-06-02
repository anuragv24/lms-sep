import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server"; // Added import
import bcrypt from "bcryptjs";

// 1. Define CORS headers at the top
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:3000', 
  'Access-Control-Allow-Credentials': 'true',             
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 2. Add OPTIONS handler for preflight check
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400, headers: corsHeaders }, // Added headers
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long.",
        },
        { status: 400, headers: corsHeaders }, // Added headers
      );
    }

    await connectDB();

    const existingUser = await User.findOne({
      email: email.toLowerCase(), // Good practice to lower case check during find as well
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists.",
        },
        { status: 400, headers: corsHeaders }, // Added headers
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully.",
      },
      { status: 201, headers: corsHeaders }, // Added headers
    );
  } catch (error) {
    console.log("Error :: signup ", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500, headers: corsHeaders }, // Added headers
    );
  }
}