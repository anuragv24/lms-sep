import { NextResponse } from "next/server";

// 1. Define CORS headers at the top
const corsHeaders = {
  'Access-Control-Allow-Origin':   process.env.FRONTEND_URL || 'http://localhost:3000', 
  'Access-Control-Allow-Credentials': 'true',             
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 2. Add OPTIONS handler for preflight check
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST() {
  try {
    // 3. FIX: Pass corsHeaders into the response setup block
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      }, 
      { status: 200, headers: corsHeaders }
    );

    // 4. FIX: Match sameSite to "lax" so the browser allows the deletion request from port 3000
    response.cookies.set({
      name: "accessToken",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Must match the setting from your login route
      maxAge: 0,
      expires: new Date(0),
      path: "/",
    });

    return response;

  } catch (error) {
    console.log("Error :: Logout", error.message);
    
    // 5. FIX: Included corsHeaders in the error catch block
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500, headers: corsHeaders },
    ); 
  }
}