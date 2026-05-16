import { NextRequest, NextResponse } from "next/server";
import { searchBooks } from "@/lib/search";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;
  const category = searchParams.get("category") || undefined;
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const badge = searchParams.get("badge") || undefined;

  if (!q || q.length < 2) {
    return NextResponse.json(
      { books: [], total: 0, searchMethod: "none" },
      { status: 200 }
    );
  }

  try {
    const result = await searchBooks(q, page, limit, {
      category,
      minPrice,
      maxPrice,
      badge,
    });

    return NextResponse.json({
      ...result,
      page,
      totalPages: Math.ceil(result.total / limit),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
