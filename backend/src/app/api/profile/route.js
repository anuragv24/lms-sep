import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/utils/verifyAuth";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.FRONTEND_URL || "http://localhost:3000",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request) {
  const decoded = verifyToken(request);
  let userObj;

  if (!decoded) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401, headers: corsHeaders },
    );
  }

  try {
    await connectDB();
    userObj = await User.findOne({ email: decoded.email }).select(
      "name email role profilePic authProvider password",
    ).lean()


    if (!userObj) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401, headers: corsHeaders },
      );
    }

    const user = {
      id: decoded.id,
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      profilePic: userObj.profilePic || "",
      authProvider: userObj.authProvider,
      hasPassword: !!userObj.password,
    };

    return NextResponse.json(
      {
        success: false,
        message: "User details",
        user: user,
      },
      { status: 200, header: corsHeaders },
    );
  } catch (error) {
    console.error("CRASH: Backend profile API failed:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Unable to retrieve profile  from the database.",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}


