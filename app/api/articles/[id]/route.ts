import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    let categoryId: number | undefined;
    if (body.categoryName) {
      const category = await prisma.articleCategory.upsert({
        where: { name: body.categoryName },
        update: {},
        create: { name: body.categoryName, slug: slugify(body.categoryName) },
      });
      categoryId = category.id;
    }

    const article = await prisma.article.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        slug: body.title ? slugify(body.title) : undefined,
        excerpt: body.excerpt,
        content: body.content,
        imageUrl: body.imageUrl,
        readTime: body.readTime ? Number(body.readTime) : undefined,
        status: body.status,
        isFeatured: body.isFeatured,
        categoryId,
        publishedAt: body.status === "Published" ? new Date() : undefined,
      },
      include: { category: true },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.article.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
