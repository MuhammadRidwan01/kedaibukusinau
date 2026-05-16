import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

// GET /api/books/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id: Number(id) },
    include: { author: true, publisher: true, category: true, genres: { include: { genre: true } } },
  });

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  return NextResponse.json(book);
}

// PUT /api/books/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
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

    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        slug: body.title ? slugify(body.title) : undefined,
        isbn: body.isbn,
        year: body.year ? Number(body.year) : null,
        pages: body.pages ? Number(body.pages) : null,
        synopsis: body.synopsis,
        price: body.price !== undefined ? Number(body.price) : undefined,
        originalPrice: body.originalPrice !== undefined ? Number(body.originalPrice) || null : undefined,
        imageUrl: body.imageUrl,
        badge: body.badge,
        availability: body.availability,
        status: body.status,
        isFeaturedBestseller: body.isFeaturedBestseller,
        authorId,
        publisherId,
        categoryId,
      },
    });

    // Update genres if provided
    if (body.genreNames && Array.isArray(body.genreNames)) {
      // Remove existing genres
      await prisma.bookGenre.deleteMany({ where: { bookId: book.id } });
      // Add new genres
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

    return NextResponse.json(fullBook);
  } catch (error) {
    console.error("Update book error:", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

// DELETE /api/books/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.book.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete book error:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
