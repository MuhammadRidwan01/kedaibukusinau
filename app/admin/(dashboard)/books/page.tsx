import React from "react";
import { getBooks } from "@/app/admin/actions/books";
import { prisma } from "@/lib/prisma";
import { BooksClient } from "./BooksClient";

export const metadata = {
  title: "Manage Books - Kedai Sinau Admin",
};

export default async function ManageBooksPage() {
  const res = await getBooks({ page: 1, limit: 20 });
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <BooksClient
      initialBooks={res.books || []}
      initialTotal={res.total || 0}
      initialPage={res.page || 1}
      initialTotalPages={res.totalPages || 1}
      categories={categories}
    />
  );
}
