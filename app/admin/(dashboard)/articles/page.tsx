import React from "react";
import { getArticles } from "@/app/admin/actions/articles";
import { ArticlesClient } from "./ArticlesClient";

export const metadata = {
  title: "Manage Articles - Kedai Sinau Admin",
};

export default async function ManageArticlesPage() {
  const res = await getArticles({ page: 1, limit: 20 });
  
  return (
    <ArticlesClient 
      initialArticles={res.articles || []} 
      initialTotal={res.total || 0}
      initialPage={res.page || 1}
      initialTotalPages={res.totalPages || 1}
    />
  );
}
