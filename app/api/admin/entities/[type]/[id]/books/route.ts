import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, id: idString } = await params;
  const id = parseInt(idString, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    let books = [];
    const select = { id: true, title: true, imageUrl: true };

    switch (type) {
      case "author":
        books = await prisma.book.findMany({
          where: { authorId: id },
          select,
          orderBy: { title: "asc" },
        });
        break;
      case "publisher":
        books = await prisma.book.findMany({
          where: { publisherId: id },
          select,
          orderBy: { title: "asc" },
        });
        break;
      case "category":
        books = await prisma.book.findMany({
          where: { categoryId: id },
          select,
          orderBy: { title: "asc" },
        });
        break;
      case "genre":
        const genreBooks = await prisma.bookGenre.findMany({
          where: { genreId: id },
          select: { book: { select } },
        });
        books = genreBooks.map((gb) => gb.book).sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Error fetching books for entity:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}
