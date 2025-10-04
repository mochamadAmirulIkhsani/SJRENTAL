// Test API endpoint for AI financial parsing
import { NextRequest, NextResponse } from "next/server";
import { parseFinancialInput } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    console.log("Testing AI parsing for:", input);

    const result = await parseFinancialInput(input);

    return NextResponse.json({
      input,
      result,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in test AI parsing:", error);
    return NextResponse.json(
      {
        error: "Failed to parse input",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
