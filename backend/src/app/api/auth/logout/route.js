import { NextResponse } from "next/server";

const corsHeaders = {
  'Access-Control-Allow-Origin':   process.env.FRONTEND_URL || 'http://localhost:3000', 
  'Access-Control-Allow-Credentials': 'true',             
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      }, 
      { status: 200, headers: corsHeaders }
    );

    response.cookies.set({
      name: "accessToken",
      value: "",
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 0,
      expires: new Date(0),
      path: "/",
    });

    return response;

  } catch (error) {
    console.log("Error :: Logout", error.message);
    
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500, headers: corsHeaders },
    ); 
  }
}