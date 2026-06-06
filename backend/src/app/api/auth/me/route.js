import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyAuth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

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
  const decoded = verifyToken(req);

  if (!decoded) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    await connectDB();
    const user = await User.findOne({email: decoded.email})

    const userDetail ={
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic || "",
      authProvider: user.authProvider,
      hasPassword: !!user.password,
    }

    return NextResponse.json({
    success: true,
    user: userDetail 
  }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error("Failed to get user details :: ", error.message);
    return NextResponse.json({
    success: false,
    message: "Internal server error"
  }, { status: 400, headers: corsHeaders });
  }

 
}