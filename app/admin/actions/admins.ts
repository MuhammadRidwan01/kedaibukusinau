"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getAdmins() {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    return { success: true, admins };
  } catch (error: any) {
    console.error("Get admins error:", error);
    return { success: false, error: error.message || "Failed to fetch admins", admins: [] };
  }
}

export async function createAdmin(data: any) {
  try {
    if (!data.name || !data.email || !data.password) {
      return { success: false, error: "All fields are required" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const admin = await prisma.admin.create({
      data: { 
        name: data.name, 
        email: data.email, 
        password: hashedPassword 
      },
    });

    revalidatePath("/admin/admins");
    return { success: true, adminId: admin.id };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Email already exists" };
    }
    console.error("Create admin error:", error);
    return { success: false, error: error.message || "Failed to create admin" };
  }
}

export async function deleteAdmin(id: number) {
  try {
    await prisma.admin.delete({ where: { id } });
    revalidatePath("/admin/admins");
    return { success: true };
  } catch (error: any) {
    console.error("Delete admin error:", error);
    return { success: false, error: error.message || "Failed to delete admin" };
  }
}
