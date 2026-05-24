import React from "react";
import { prisma } from "@/lib/prisma";
import { EditorClient } from "./EditorClient";

export const metadata = {
  title: "Article Editor - Kedai Sinau Admin",
};

import { Suspense } from "react";

export default function ArticleEditorPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading editor...</div>}>
      <EditorLoader searchParams={searchParams} />
    </Suspense>
  );
}

async function EditorLoader({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const params = await searchParams;
  let article = null;
  
  if (params.id) {
    article = await prisma.article.findUnique({
      where: { id: Number(params.id) },
      include: { category: true }
    });
  }

  const categories = await prisma.articleCategory.findMany({ orderBy: { name: 'asc' } });
  
  return (
    <EditorClient 
      initialArticle={article} 
      categories={categories}
    />
  );
}
