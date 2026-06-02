import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const corsHeaders = {
  'Access-Control-Allow-Origin':  process.env.FRONTEND_URL || 'http://localhost:3000', 
  'Access-Control-Allow-Credentials': 'true',             
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Make sure OPTIONS is here
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 1. ADD OPTIONS METHOD FOR BROWSER PREFLIGHT CHECKS
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 400, headers: corsHeaders }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Wrong credentials." },
        { status: 400, headers: corsHeaders }
      );
    }

    const tokenPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 2. FIX: Pass corsHeaders into the success response configuration block
    const response = NextResponse.json(
      {
        success: true,
        message: "Login Successful",
        role: user.role
      }, 
      { status: 200, headers: corsHeaders } // Added here
    );

    // 3. FIX: Changed sameSite from "strict" to "lax" for cross-origin local storage
    response.cookies.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", 
      maxAge: 60 * 60 * 24 * 1,
      path: "/",
    });

    return response;

  } catch (error) {
    console.log("Error :: Login ", error.message);
    
    // 4. FIX: Consistent use of NextResponse and included corsHeaders
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}