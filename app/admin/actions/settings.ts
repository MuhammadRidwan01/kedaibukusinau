"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { auth } from "@/auth";

// Settings
export async function updateSettings(data: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.storeSettings.upsert({
      where: { id: 1 },
      update: { ...data },
      create: { id: 1, ...data },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    updateTag("store-settings");
    updateTag("about-page");
    updateTag("home-page");
    return { success: true };
  } catch (error: any) {
    console.error("Update settings error:", error);
    return { success: false, error: error.message || "Failed to update settings" };
  }
}

// Banners
export async function createBanner(data: { imageUrl: string, altText?: string, order?: number, isActive?: boolean }) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.banner.create({
      data: {
        imageUrl: data.imageUrl,
        altText: data.altText || null,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    updateTag("home-data");
    updateTag("home-page");
    return { success: true };
  } catch (error: any) {
    console.error("Create banner error:", error);
    return { success: false, error: error.message || "Failed to create banner" };
  }
}

export async function updateBanner(id: number, data: { altText?: string, order?: number, isActive?: boolean }) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.banner.update({
      where: { id },
      data: {
        altText: data.altText || null,
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
      },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    updateTag("home-data");
    updateTag("home-page");
    return { success: true };
  } catch (error: any) {
    console.error("Update banner error:", error);
    return { success: false, error: error.message || "Failed to update banner" };
  }
}

export async function deleteBanner(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.banner.delete({ where: { id } });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    updateTag("home-data");
    updateTag("home-page");
    return { success: true };
  } catch (error: any) {
    console.error("Delete banner error:", error);
    return { success: false, error: error.message || "Failed to delete banner" };
  }
}

// Testimonials
export async function createTestimonial(data: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.testimonial.create({
      data: {
        name: data.name,
        city: data.city,
        rating: data.rating || 5,
        text: data.text,
        order: data.order || 0,
      },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    updateTag("home-data");
    updateTag("home-page");
    return { success: true };
  } catch (error: any) {
    console.error("Create testimonial error:", error);
    return { success: false, error: error.message || "Failed to create testimonial" };
  }
}

export async function updateTestimonial(id: number, data: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        name: data.name,
        city: data.city,
        rating: data.rating,
        text: data.text,
        order: data.order,
      },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    updateTag("home-data");
    updateTag("home-page");
    return { success: true };
  } catch (error: any) {
    console.error("Update testimonial error:", error);
    return { success: false, error: error.message || "Failed to update testimonial" };
  }
}

export async function deleteTestimonial(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    updateTag("home-data");
    updateTag("home-page");
    return { success: true };
  } catch (error: any) {
    console.error("Delete testimonial error:", error);
    return { success: false, error: error.message || "Failed to delete testimonial" };
  }
}
