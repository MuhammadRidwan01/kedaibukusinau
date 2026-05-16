import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const status = searchParams.get("status") || undefined;
  const categoryId = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (categoryId) where.categoryId = categoryId;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({ articles, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let categoryId: number | undefined;
    if (body.categoryName) {
      const category = await prisma.articleCategory.upsert({
        where: { name: body.categoryName },
        update: {},
        create: { name: body.categoryName, slug: slugify(body.categoryName) },
      });
      categoryId = category.id;
    }

    const article = await prisma.article.create({
      data: {
        slug: slugify(body.title),
        title: body.title,
        excerpt: body.excerpt || null,
        content: body.content || "",
        imageUrl: body.imageUrl || null,
        readTime: body.readTime ? Number(body.readTime) : null,
        status: body.status || "Draft",
        isFeatured: body.isFeatured || false,
        categoryId,
        publishedAt: body.status === "Published" ? new Date() : null,
      },
      include: { category: true },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
