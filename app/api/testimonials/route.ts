import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(testimonials);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const testimonial = await prisma.testimonial.create({
    data: {
      name: body.name,
      city: body.city,
      rating: body.rating || 5,
      text: body.text,
      order: body.order || 0,
    },
  });
  return NextResponse.json(testimonial, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const testimonial = await prisma.testimonial.update({
    where: { id: body.id },
    data: {
      name: body.name,
      city: body.city,
      rating: body.rating,
      text: body.text,
      order: body.order,
    },
  });
  return NextResponse.json(testimonial);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
