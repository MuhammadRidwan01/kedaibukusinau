import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.storeSettings.create({ data: { id: 1 } });
  }
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const settings = await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: { ...body },
    create: { id: 1, ...body },
  });
  return NextResponse.json(settings);
}
