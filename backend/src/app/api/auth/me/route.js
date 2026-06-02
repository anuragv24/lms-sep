import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyAuth";

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

  return NextResponse.json({
    success: true,
    user: decoded // Contains id, name, email, role from your payload
  }, { status: 200, headers: corsHeaders });
}