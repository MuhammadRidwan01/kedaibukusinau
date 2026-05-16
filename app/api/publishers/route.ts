import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q") || "";
  const publishers = await prisma.publisher.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : {},
    orderBy: { name: "asc" },
    take: 10,
    include: { _count: { select: { books: true } } },
  });
  return NextResponse.json(publishers);
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const publisher = await prisma.publisher.upsert({
    where: { name },
    update: {},
    create: { name },
  });
  return NextResponse.json(publisher, { status: 201 });
}
