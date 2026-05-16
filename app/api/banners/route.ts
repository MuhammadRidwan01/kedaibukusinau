import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const banners = await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(banners);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const banner = await prisma.banner.create({
    data: {
      imageUrl: body.imageUrl,
      altText: body.altText || null,
      order: body.order || 0,
      isActive: body.isActive ?? true,
    },
  });
  return NextResponse.json(banner, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
