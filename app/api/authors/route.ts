import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q") || "";
  const authors = await prisma.author.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : {},
    orderBy: { name: "asc" },
    take: 10,
    include: { _count: { select: { books: true } } },
  });
  return NextResponse.json(authors);
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const author = await prisma.author.upsert({
    where: { name },
    update: {},
    create: { name, slug: slugify(name) },
  });
  return NextResponse.json(author, { status: 201 });
}
