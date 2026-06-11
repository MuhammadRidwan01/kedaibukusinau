import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES = ["author", "publisher", "category", "genre"] as const;
type EntityType = (typeof ALLOWED_TYPES)[number];

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as EntityType | null;
  const q = searchParams.get("q") || "";

  if (!type || !ALLOWED_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  if (q.length < 1) {
    return NextResponse.json([]);
  }

  try {
    const where = { name: { contains: q, mode: "insensitive" as const } };
    const select = { id: true, name: true, _count: { select: { books: true } } };
    const take = 10;

    let results;

    switch (type) {
      case "author":
        results = await prisma.author.findMany({ where, select, take, orderBy: { name: "asc" } });
        break;
      case "publisher":
        results = await prisma.publisher.findMany({ where, select, take, orderBy: { name: "asc" } });
        break;
      case "category":
        results = await prisma.category.findMany({ where, select, take, orderBy: { name: "asc" } });
        break;
      case "genre":
        results = await prisma.genre.findMany({ where, select, take, orderBy: { name: "asc" } });
        break;
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Entity search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
