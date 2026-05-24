"use server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { revalidatePath, updateTag } from "next/cache";

export async function getBooks(params?: { q?: string; categoryId?: number; status?: string; page?: number; limit?: number }) {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const q = params?.q || "";
    
    const where: any = {};
    if (params?.status && params.status !== "All Status") where.status = params.status;
    if (params?.categoryId) where.categoryId = params.categoryId;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { author: { name: { contains: q, mode: 'insensitive' } } },
        { isbn: { contains: q, mode: 'insensitive' } }
      ];
    }

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

    return { success: true, books, total, page, totalPages: Math.ceil(total / limit) };
  } catch (error: any) {
    console.error("Get books error:", error);
    return { success: false, error: error.message || "Failed to fetch books", books: [], total: 0 };
  }
}

export async function createBook(data: any) {
  try {
    let authorId: number | undefined;
    if (data.authorName) {
      const author = await prisma.author.upsert({
        where: { name: data.authorName },
        update: {},
        create: { name: data.authorName, slug: slugify(data.authorName) },
      });
      authorId = author.id;
    }

    let publisherId: number | undefined;
    if (data.publisherName) {
      const publisher = await prisma.publisher.upsert({
        where: { name: data.publisherName },
        update: {},
        create: { name: data.publisherName },
      });
      publisherId = publisher.id;
    }

    let categoryId: number | undefined;
    if (data.categoryName) {
      const category = await prisma.category.upsert({
        where: { name: data.categoryName },
        update: {},
        create: { name: data.categoryName, slug: slugify(data.categoryName) },
      });
      categoryId = category.id;
    }

    const book = await prisma.book.create({
      data: {
        slug: slugify(data.title),
        title: data.title,
        isbn: data.isbn || null,
        year: data.year ? Number(data.year) : null,
        pages: data.pages ? Number(data.pages) : null,
        synopsis: data.synopsis || null,
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        imageUrl: data.imageUrl || null,
        badge: data.badge || null,
        availability: data.availability || "Available",
        status: data.status || "Active",
        isFeaturedBestseller: data.isFeaturedBestseller || false,
        authorId,
        publisherId,
        categoryId,
      },
    });

    if (data.genreNames && Array.isArray(data.genreNames)) {
      for (const genreName of data.genreNames) {
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

    revalidatePath("/", "layout");
    revalidatePath("/admin/books");
    revalidatePath("/admin");
    updateTag("home-data");
    updateTag("home-page");
    updateTag("catalog-sidebar");
    updateTag("catalog-books");
    if (book?.slug) {
      updateTag(`book-${book.slug}`);
      updateTag(`book-page-${book.slug}`);
    }
    return { success: true, bookId: book.id };
  } catch (error: any) {
    console.error("Create book error:", error);
    return { success: false, error: error.message || "Failed to create book" };
  }
}

export async function updateBook(id: number, data: any) {
  try {
    let authorId: number | undefined;
    if (data.authorName) {
      const author = await prisma.author.upsert({
        where: { name: data.authorName },
        update: {},
        create: { name: data.authorName, slug: slugify(data.authorName) },
      });
      authorId = author.id;
    }

    let publisherId: number | undefined;
    if (data.publisherName) {
      const publisher = await prisma.publisher.upsert({
        where: { name: data.publisherName },
        update: {},
        create: { name: data.publisherName },
      });
      publisherId = publisher.id;
    }

    let categoryId: number | undefined;
    if (data.categoryName) {
      const category = await prisma.category.upsert({
        where: { name: data.categoryName },
        update: {},
        create: { name: data.categoryName, slug: slugify(data.categoryName) },
      });
      categoryId = category.id;
    }

    const oldBook = await prisma.book.findUnique({ where: { id }, select: { slug: true } });

    const book = await prisma.book.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.title ? slugify(data.title) : undefined,
        isbn: data.isbn,
        year: data.year ? Number(data.year) : null,
        pages: data.pages ? Number(data.pages) : null,
        synopsis: data.synopsis,
        price: data.price !== undefined ? Number(data.price) : undefined,
        originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) || null : undefined,
        imageUrl: data.imageUrl,
        badge: data.badge,
        availability: data.availability,
        status: data.status,
        isFeaturedBestseller: data.isFeaturedBestseller,
        authorId,
        publisherId,
        categoryId,
      },
    });

    if (data.genreNames && Array.isArray(data.genreNames)) {
      await prisma.bookGenre.deleteMany({ where: { bookId: book.id } });
      for (const genreName of data.genreNames) {
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

    revalidatePath("/", "layout");
    revalidatePath("/admin/books");
    revalidatePath("/admin");
    updateTag("home-data");
    updateTag("home-page");
    updateTag("catalog-sidebar");
    updateTag("catalog-books");
    if (oldBook?.slug) {
      updateTag(`book-${oldBook.slug}`);
      updateTag(`book-page-${oldBook.slug}`);
    }
    updateTag(`book-${book.slug}`);
    updateTag(`book-page-${book.slug}`);
    return { success: true, bookId: book.id };
  } catch (error: any) {
    console.error("Update book error:", error);
    return { success: false, error: error.message || "Failed to update book" };
  }
}

export async function deleteBook(id: number) {
  try {
    const book = await prisma.book.findUnique({ where: { id } });
    await prisma.book.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/books");
    revalidatePath("/admin");
    updateTag("home-data");
    updateTag("home-page");
    updateTag("catalog-sidebar");
    updateTag("catalog-books");
    updateTag("books-list");
    if (book?.slug) {
      updateTag(`book-${book.slug}`);
      updateTag(`book-page-${book.slug}`);
      updateTag(`book-details-${book.slug}`);
    }
    return { success: true };
  } catch (error: any) {
    console.error("Delete book error:", error);
    return { success: false, error: error.message || "Failed to delete book" };
  }
}
