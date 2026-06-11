"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { slugify } from "@/lib/utils";
import { revalidatePath, updateTag } from "next/cache";

type MetadataType = "author" | "publisher" | "category" | "genre";

export async function getMetadata(type: MetadataType) {
  try {
    const select = { 
      id: true, 
      name: true, 
      _count: { select: { books: true } }
    };
    
    let data;
    switch (type) {
      case "author":
        data = await prisma.author.findMany({ select, orderBy: { name: "asc" } });
        break;
      case "publisher":
        data = await prisma.publisher.findMany({ select, orderBy: { name: "asc" } });
        break;
      case "category":
        data = await prisma.category.findMany({ select, orderBy: { name: "asc" } });
        break;
      case "genre":
        data = await prisma.genre.findMany({ select, orderBy: { name: "asc" } });
        break;
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error(`Get ${type} error:`, error);
    return { success: false, error: error.message || "Failed to fetch data", data: [] };
  }
}

export async function updateMetadata(type: MetadataType, id: number, name: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    const slug = type !== "publisher" ? slugify(name) : undefined;
    
    switch (type) {
      case "author":
        await prisma.author.update({ where: { id }, data: { name, slug } });
        break;
      case "publisher":
        await prisma.publisher.update({ where: { id }, data: { name } });
        break;
      case "category":
        await prisma.category.update({ where: { id }, data: { name, slug } });
        break;
      case "genre":
        await prisma.genre.update({ where: { id }, data: { name, slug } });
        break;
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/metadata");
    updateTag("home-data");
    updateTag("catalog-sidebar");
    updateTag("catalog-books");
    
    return { success: true };
  } catch (error: any) {
    console.error(`Update ${type} error:`, error);
    // Handle unique constraint violation gracefully
    if (error.code === 'P2002') {
      return { success: false, error: `Name "${name}" already exists.` };
    }
    return { success: false, error: error.message || "Failed to update data" };
  }
}

export async function deleteMetadata(type: MetadataType, id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    // First, verify count is 0. We don't want to rely solely on Prisma errors, 
    // it's cleaner to check and provide a friendly error message.
    let count = 0;
    switch (type) {
      case "author":
        count = await prisma.book.count({ where: { authorId: id } });
        break;
      case "publisher":
        count = await prisma.book.count({ where: { publisherId: id } });
        break;
      case "category":
        count = await prisma.book.count({ where: { categoryId: id } });
        break;
      case "genre":
        count = await prisma.bookGenre.count({ where: { genreId: id } });
        break;
    }

    if (count > 0) {
      return { success: false, error: `Cannot delete. Still used by ${count} book(s).` };
    }

    switch (type) {
      case "author":
        await prisma.author.delete({ where: { id } });
        break;
      case "publisher":
        await prisma.publisher.delete({ where: { id } });
        break;
      case "category":
        await prisma.category.delete({ where: { id } });
        break;
      case "genre":
        await prisma.genre.delete({ where: { id } });
        break;
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/metadata");
    updateTag("catalog-sidebar");
    
    return { success: true };
  } catch (error: any) {
    console.error(`Delete ${type} error:`, error);
    return { success: false, error: error.message || "Failed to delete data" };
  }
}
