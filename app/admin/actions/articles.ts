"use server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { revalidatePath, updateTag } from "next/cache";

export async function getArticles(params?: { q?: string; categoryId?: number; status?: string; page?: number; limit?: number }) {
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
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return { success: true, articles, total, page, totalPages: Math.ceil(total / limit) };
  } catch (error: any) {
    console.error("Get articles error:", error);
    return { success: false, error: error.message || "Failed to fetch articles", articles: [], total: 0 };
  }
}

export async function createArticle(data: any) {
  try {
    let categoryId: number | undefined;
    if (data.categoryName) {
      const category = await prisma.articleCategory.upsert({
        where: { name: data.categoryName },
        update: {},
        create: { name: data.categoryName, slug: slugify(data.categoryName) },
      });
      categoryId = category.id;
    }

    const article = await prisma.article.create({
      data: {
        slug: slugify(data.title),
        title: data.title,
        excerpt: data.excerpt || null,
        content: data.content || "",
        imageUrl: data.imageUrl || null,
        readTime: data.readTime ? Number(data.readTime) : null,
        status: data.status || "Draft",
        isFeatured: data.isFeatured || false,
        categoryId,
        publishedAt: data.status === "Published" ? new Date() : null,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/articles");
    revalidatePath("/admin");
    updateTag("home-data");
    updateTag("home-page");
    updateTag("journal-page");
    if (article?.slug) updateTag(`article-page-${article.slug}`);
    return { success: true, articleId: article.id };
  } catch (error: any) {
    console.error("Create article error:", error);
    return { success: false, error: error.message || "Failed to create article" };
  }
}

export async function updateArticle(id: number, data: any) {
  try {
    let categoryId: number | undefined;
    if (data.categoryName) {
      const category = await prisma.articleCategory.upsert({
        where: { name: data.categoryName },
        update: {},
        create: { name: data.categoryName, slug: slugify(data.categoryName) },
      });
      categoryId = category.id;
    }

    const oldArticle = await prisma.article.findUnique({ where: { id }, select: { slug: true } });

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.title ? slugify(data.title) : undefined,
        excerpt: data.excerpt,
        content: data.content,
        imageUrl: data.imageUrl,
        readTime: data.readTime ? Number(data.readTime) : undefined,
        status: data.status,
        isFeatured: data.isFeatured,
        categoryId,
        publishedAt: data.status === "Published" ? new Date() : undefined,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/articles");
    revalidatePath("/admin");
    updateTag("home-data");
    updateTag("home-page");
    updateTag("journal-page");
    if (oldArticle?.slug) updateTag(`article-page-${oldArticle.slug}`);
    if (article?.slug) updateTag(`article-page-${article.slug}`);
    return { success: true, articleId: article.id };
  } catch (error: any) {
    console.error("Update article error:", error);
    return { success: false, error: error.message || "Failed to update article" };
  }
}

export async function deleteArticle(id: number) {
  try {
    await prisma.article.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/articles");
    revalidatePath("/admin");
    updateTag("home-data");
    updateTag("home-page");
    updateTag("journal-page");
    return { success: true };
  } catch (error: any) {
    console.error("Delete article error:", error);
    return { success: false, error: error.message || "Failed to delete article" };
  }
}
