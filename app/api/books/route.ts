import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

// GET /api/books — List books (paginated, filterable)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const status = searchParams.get("status") || undefined;
  const categoryId = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : undefined;
  const authorId = searchParams.get("authorId")
    ? Number(searchParams.get("authorId"))
    : undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (categoryId) where.categoryId = categoryId;
  if (authorId) where.authorId = authorId;

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      include: { author: true, publisher: true, category: true, genres: { include: { genre: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.book.count({ where }),
  ]);

  return NextResponse.json({ books, total, page, totalPages: Math.ceil(total / limit) });
}

// POST /api/books — Create book (with find-or-create for author/publisher/category/genres)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Find or create Author
    let authorId: number | undefined;
    if (body.authorName) {
      const author = await prisma.author.upsert({
        where: { name: body.authorName },
        update: {},
        create: { name: body.authorName, slug: slugify(body.authorName) },
      });
      authorId = author.id;
    }

    // Find or create Publisher
    let publisherId: number | undefined;
    if (body.publisherName) {
      const publisher = await prisma.publisher.upsert({
        where: { name: body.publisherName },
        update: {},
        create: { name: body.publisherName },
      });
      publisherId = publisher.id;
    }

    // Find or create Category
    let categoryId: number | undefined;
    if (body.categoryName) {
      const category = await prisma.category.upsert({
        where: { name: body.categoryName },
        update: {},
        create: { name: body.categoryName, slug: slugify(body.categoryName) },
      });
      categoryId = category.id;
    }

    // Create the book
    const book = await prisma.book.create({
      data: {
        slug: slugify(body.title),
        title: body.title,
        isbn: body.isbn || null,
        year: body.year ? Number(body.year) : null,
        pages: body.pages ? Number(body.pages) : null,
        synopsis: body.synopsis || null,
        price: Number(body.price),
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        imageUrl: body.imageUrl || null,
        badge: body.badge || null,
        availability: body.availability || "Available",
        status: body.status || "Active",
        isFeaturedBestseller: body.isFeaturedBestseller || false,
        authorId,
        publisherId,
        categoryId,
      },
      include: { author: true, publisher: true, category: true },
    });

    // Connect genres (find or create each)
    if (body.genreNames && Array.isArray(body.genreNames)) {
      for (const genreName of body.genreNames) {
        const genre = await prisma.genre.upsert({
          where: { name: genreName },
          update: {},
          create: { name: genreName, slug: slugify(genreName) },
        });
        await prisma.bookGenre.create({
          data: { bookId: book.id, genreId: genre.id },
        });
      }
    }

    const fullBook = await prisma.book.findUnique({
      where: { id: book.id },
      include: { author: true, publisher: true, category: true, genres: { include: { genre: true } } },
    });

    return NextResponse.json(fullBook, { status: 201 });
  } catch (error) {
    console.error("Create book error:", error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
