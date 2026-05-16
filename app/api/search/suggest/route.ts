import { NextRequest, NextResponse } from "next/server";
import { getSuggestion } from "@/lib/search";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json({ suggestion: null });
  }

  try {
    const suggestion = await getSuggestion(q);
    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("Suggest error:", error);
    return NextResponse.json({ suggestion: null });
  }
}
