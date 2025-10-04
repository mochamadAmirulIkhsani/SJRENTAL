// Test API endpoint to verify environment variables
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const geminiKey = process.env.GEMINI_API_KEY;

  return NextResponse.json({
    hasGeminiKey: !!geminiKey,
    keyLength: geminiKey?.length,
    nodeEnv: process.env.NODE_ENV,
    environment: {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    },
  });
}
