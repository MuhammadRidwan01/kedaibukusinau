import React from "react";
import { getMetadata } from "@/app/admin/actions/metadata";
import { MetadataClient } from "./MetadataClient";

export const metadata = {
  title: "Manage Metadata - Kedai Sinau Admin",
};

export default async function ManageMetadataPage() {
  const [authorsRes, publishersRes, categoriesRes, genresRes] = await Promise.all([
    getMetadata("author"),
    getMetadata("publisher"),
    getMetadata("category"),
    getMetadata("genre"),
  ]);
  
  return (
    <MetadataClient 
      initialAuthors={authorsRes.data || []}
      initialPublishers={publishersRes.data || []}
      initialCategories={categoriesRes.data || []}
      initialGenres={genresRes.data || []}
    />
  );
}
