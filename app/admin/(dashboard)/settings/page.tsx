import React from "react";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./SettingsClient";

export const metadata = {
  title: "Store Settings - Kedai Sinau Admin",
};

export default async function StoreSettingsPage() {
  const [settings, banners, testimonials] = await Promise.all([
    prisma.storeSettings.findFirst(),
    prisma.banner.findMany({ orderBy: { order: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
  ]);
  
  return (
    <SettingsClient 
      settings={settings} 
      banners={banners} 
      testimonials={testimonials} 
    />
  );
}
