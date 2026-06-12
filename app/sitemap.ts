import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

async function getSitemapData() {
  "use cache";
  cacheLife("days");
  cacheTag("sitemap");

  const [books, articles] = await Promise.all([
    prisma.book.findMany({
      where: { status: "Active" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.article.findMany({
      where: { status: "Published" },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  return { books, articles };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { books, articles } = await getSitemapData();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/catalog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/new-releases`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/journal`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${siteUrl}/catalog/${book.slug}`,
    lastModified: book.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/journal/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...bookPages, ...articlePages];
}
