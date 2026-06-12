"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  updateSettings,
  createBanner,
  updateBanner,
  deleteBanner,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/app/admin/actions/settings";

export function SettingsClient({ settings, banners, testimonials: initialTestimonials }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    storeName: settings?.storeName || "",
    description: settings?.description || "",
    logoUrl: settings?.logoUrl || "",
    whatsapp: settings?.whatsapp || "",
    email: settings?.email || "",
    address: settings?.address || "",
    instagramUrl: settings?.instagramUrl || "",
    shopeeUrl: settings?.shopeeUrl || "",
    tiktokUrl: settings?.tiktokUrl || "",
    facebookUrl: settings?.facebookUrl || "",
    aboutHeroImage: settings?.aboutHeroImage || "",
    storeStory: settings?.storeStory || "",
    visionStatement: settings?.visionStatement || "",
  });

  const [missionPoints, setMissionPoints] = useState<string[]>(() => {
    try {
      return settings?.missionPoints ? JSON.parse(settings.missionPoints) : [""];
    } catch {
      return [""];
    }
  });

  const [testimonials, setTestimonials] = useState(initialTestimonials || []);
  const [bannerItems, setBannerItems] = useState(banners || []);

  // Sync props to state on prop changes (e.g. after router.refresh())
  useEffect(() => {
    setFormData({
      storeName: settings?.storeName || "",
      description: settings?.description || "",
      logoUrl: settings?.logoUrl || "",
      whatsapp: settings?.whatsapp || "",
      email: settings?.email || "",
      address: settings?.address || "",
      instagramUrl: settings?.instagramUrl || "",
      shopeeUrl: settings?.shopeeUrl || "",
      tiktokUrl: settings?.tiktokUrl || "",
      facebookUrl: settings?.facebookUrl || "",
      aboutHeroImage: settings?.aboutHeroImage || "",
      storeStory: settings?.storeStory || "",
      visionStatement: settings?.visionStatement || "",
    });
    setMissionPoints(() => {
      try {
        return settings?.missionPoints ? JSON.parse(settings.missionPoints) : [""];
      } catch {
        return [""];
      }
    });
    setTestimonials(initialTestimonials || []);
    setBannerItems(banners || []);
    setDeletedIds([]);
    setIsDirty(false);
  }, [settings, initialTestimonials, banners]);

  // Prevent accidental navigation/closing if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setLoading(true);
    toast.loading("Saving settings...", { id: "save-settings" });

    try {
      // 1. Save settings
      const settingsRes = await updateSettings({
        ...formData,
        missionPoints: JSON.stringify(missionPoints.filter((p) => p.trim() !== "")),
      });

      if (!settingsRes.success) {
        throw new Error(settingsRes.error || "Failed to update store settings");
      }

      // 2. Perform testimonial mutations (Deletions, Updates, Creations) in parallel
      const testimonialPromises = [];

      // Deletions
      for (const id of deletedIds) {
        testimonialPromises.push(deleteTestimonial(id));
      }

      // Creations and Updates
      for (const t of testimonials) {
        if (t.isNew) {
          testimonialPromises.push(
            createTestimonial({
              name: t.name,
              city: t.city,
              rating: Number(t.rating || 5),
              text: t.text,
              order: t.order || 0,
            })
          );
        } else if (t.isUpdated) {
          testimonialPromises.push(
            updateTestimonial(t.id, {
              name: t.name,
              city: t.city,
              rating: Number(t.rating || 5),
              text: t.text,
              order: t.order || 0,
            })
          );
        }
      }

      const results = await Promise.all(testimonialPromises);
      const failed = results.find((r) => !r.success);

      if (failed) {
        throw new Error(failed.error || "Failed to save some testimonials");
      }

      toast.success("Settings saved successfully", { id: "save-settings" });
      setIsDirty(false);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save settings", { id: "save-settings" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    toast.loading("Uploading image...", { id: "upload" });
    try {
      const res = await fetch(`/api/upload?type=${type}`, { method: "POST", body: data });
      const json = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, [field]: json.url }));
        setIsDirty(true);
        toast.success("Image uploaded", { id: "upload" });
      } else {
        toast.error(json.error || "Upload failed", { id: "upload" });
      }
    } catch (err) {
      toast.error("Upload error", { id: "upload" });
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    toast.loading("Uploading banner...", { id: "upload" });
    try {
      const res = await fetch("/api/upload?type=banner", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok) {
        await createBanner({ imageUrl: json.url });
        toast.success("Banner added", { id: "upload" });
        router.refresh();
      } else {
        toast.error(json.error || "Upload failed", { id: "upload" });
      }
    } catch (err) {
      toast.error("Upload error", { id: "upload" });
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (confirm("Delete this banner?")) {
      await deleteBanner(id);
      router.refresh();
    }
  };

  const handleBannerChange = (id: number, field: string, value: any) => {
    setBannerItems(
      bannerItems.map((banner: any) =>
        banner.id === id ? { ...banner, [field]: value, isUpdated: true } : banner
      )
    );
  };

  const handleSaveBanner = async (banner: any) => {
    toast.loading("Saving banner...", { id: `banner-${banner.id}` });
    const res = await updateBanner(banner.id, {
      altText: banner.altText || "",
      order: Number(banner.order || 0),
      isActive: Boolean(banner.isActive),
    });

    if (res.success) {
      toast.success("Banner updated", { id: `banner-${banner.id}` });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update banner", { id: `banner-${banner.id}` });
    }
  };

  const handleRemoveTestimonial = (id: number, isNew?: boolean) => {
    if (!isNew) {
      setDeletedIds((prev) => [...prev, id]);
    }
    setTestimonials(testimonials.filter((t: any) => t.id !== id));
    setIsDirty(true);
  };

  const handleAddTestimonial = () => {
    setTestimonials([...testimonials, { id: Date.now(), name: "", city: "", rating: 5, text: "", isNew: true }]);
    setIsDirty(true);
  };

  const handleTestimonialChange = (id: number, field: string, value: any) => {
    setTestimonials(
      testimonials.map((t: any) => {
        if (t.id === id) {
          return { ...t, [field]: value, isUpdated: !t.isNew };
        }
        return t;
      })
    );
    setIsDirty(true);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end pb-8 border-b border-outline-variant/80 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
            Global Configuration
          </span>
          <h2 className="font-headline-h2 text-3xl lg:text-4xl text-on-surface italic tracking-tight">
            Store Settings
          </h2>
        </div>
        
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${isDirty ? 'opacity-100' : 'opacity-0'}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-inter text-xs text-on-surface-variant">
              Unsaved changes
            </span>
          </div>
          <button
            type="button"
            disabled={loading || !isDirty}
            onClick={handleSave}
            className="flex items-center gap-2 bg-on-surface text-white font-newsreader uppercase tracking-widest text-xs px-8 py-3 hover:bg-primary transition-all duration-300 shadow-xl shadow-on-surface/10 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </header>

      <div className="w-full">
        <form
          id="settingsForm"
          className="max-w-[800px] mx-auto pt-8 flex flex-col gap-16 md:gap-24 pb-32"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* 01. Store Identity */}
          <div className="flex flex-col gap-10">
            <div className="flex items-baseline border-b border-outline-variant/50 pb-4">
              <span className="font-newsreader text-sm italic text-on-surface-variant/40 mr-3">01.</span>
              <h3 className="font-headline-h3 text-2xl text-on-surface">Store Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="flex flex-col md:col-span-2">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => handleInputChange("storeName", e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-newsreader font-medium text-xl text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Brief Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300 h-24 resize-none"
                ></textarea>
              </div>
              <div className="flex flex-col md:col-span-2 gap-3">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Brand Logo
                </label>
                <label className="w-full h-32 border-2 border-dashed border-outline-variant bg-white flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group relative overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "logoUrl", "logo")}
                  />
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} className="h-full object-contain p-2" alt="Logo" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary mb-2 text-2xl">
                        upload_file
                      </span>
                      <span className="font-newsreader italic text-sm text-on-surface-variant group-hover:text-primary">
                        Click to upload logo
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* 02. Contact Info */}
          <div className="flex flex-col gap-10">
            <div className="flex items-baseline border-b border-outline-variant/50 pb-4">
              <span className="font-newsreader text-sm italic text-on-surface-variant/40 mr-3">02.</span>
              <h3 className="font-headline-h3 text-2xl text-on-surface">Contact Info</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  WhatsApp
                </label>
                <div className="flex items-stretch border-b border-outline-variant focus-within:border-primary transition-all">
                  <span className="flex items-center px-3 font-inter text-sm font-medium text-on-surface-variant bg-on-surface/[0.04] border-r border-outline-variant/50 select-none shrink-0">
                    +62
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="812-3456-7890"
                    value={
                      formData.whatsapp
                        ? formData.whatsapp.replace(/^\+?62/, "").replace(/^0+/, "")
                        : ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9\-\s]/g, "").replace(/^0+/, "");
                      handleInputChange("whatsapp", raw ? `+62${raw.replace(/[\-\s]/g, "")}` : "");
                    }}
                    className="w-full bg-transparent border-0 py-2 pl-3 font-inter text-sm text-on-surface focus:outline-none tracking-wide"
                  />
                </div>
                {formData.whatsapp && (
                  <span className="font-inter text-[11px] text-on-surface-variant/60 mt-1.5 flex items-center gap-1.5">
                    <svg className="w-3 h-3 fill-[#25D366] shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    wa.me/{formData.whatsapp.replace(/[^0-9]/g, "")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all h-20 resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* 03. Social Media */}
          <div className="flex flex-col gap-10">
            <div className="flex items-baseline border-b border-outline-variant/50 pb-4">
              <span className="font-newsreader text-sm italic text-on-surface-variant/40 mr-3">03.</span>
              <h3 className="font-headline-h3 text-2xl text-on-surface">Social Media</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Shopee
                </label>
                <input
                  type="url"
                  value={formData.shopeeUrl}
                  onChange={(e) => handleInputChange("shopeeUrl", e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  TikTok
                </label>
                <input
                  type="url"
                  value={formData.tiktokUrl}
                  onChange={(e) => handleInputChange("tiktokUrl", e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* 04. Homepage Banner */}
          <div className="flex flex-col gap-10">
            <div className="flex items-baseline border-b border-outline-variant/50 pb-4">
              <span className="font-newsreader text-sm italic text-on-surface-variant/40 mr-3">04.</span>
              <h3 className="font-headline-h3 text-2xl text-on-surface">Homepage Banner</h3>
            </div>
            <div className="flex flex-col gap-8">
              <label className="w-full aspect-[21/9] border-2 border-dashed border-outline-variant bg-white flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group relative overflow-hidden">
                <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary mb-2 text-3xl">
                  add_photo_alternate
                </span>
                <span className="font-newsreader italic text-sm text-on-surface-variant group-hover:text-primary">
                  Click to add new carousel slide
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {bannerItems?.map((banner: any) => (
                  <div key={banner.id} className="bg-white border border-outline-variant/40 p-4 flex flex-col gap-4">
                    <div className="relative group">
                      <img
                        src={banner.imageUrl}
                        className="w-full aspect-[21/9] object-cover grayscale group-hover:grayscale-0 border border-outline-variant/50 transition-all"
                        alt={banner.altText || "Banner"}
                      />
                      <div className="absolute inset-0 bg-[#1A1A1A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="text-white hover:text-primary transition-colors"
                          title="Delete Slide"
                        >
                          <span className="material-symbols-outlined text-[24px]">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-[1fr_4rem] gap-4">
                      <div className="flex flex-col">
                        <label className="font-label-sm text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          value={banner.altText || ""}
                          onChange={(e) => handleBannerChange(banner.id, "altText", e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-outline-variant py-1.5 font-inter text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-label-sm text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">
                          Order
                        </label>
                        <input
                          type="number"
                          value={banner.order ?? 0}
                          onChange={(e) => handleBannerChange(banner.id, "order", e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-outline-variant py-1.5 font-inter text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(banner.isActive)}
                          onChange={(e) => handleBannerChange(banner.id, "isActive", e.target.checked)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span className="font-label-sm text-[9px] uppercase tracking-widest text-on-surface-variant">
                          Active
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleSaveBanner(banner)}
                        disabled={!banner.isUpdated}
                        className="font-label-sm text-[9px] uppercase tracking-widest text-primary disabled:text-outline-variant disabled:opacity-40"
                      >
                        Save Banner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 05. Testimonials */}
          <div className="flex flex-col gap-10">
            <div className="flex items-baseline border-b border-outline-variant/50 pb-4">
              <span className="font-newsreader text-sm italic text-on-surface-variant/40 mr-3">05.</span>
              <h3 className="font-headline-h3 text-2xl text-on-surface">Testimonials</h3>
            </div>
            <div className="flex flex-col gap-8">
              {testimonials.map((testimonial: any) => (
                <div key={testimonial.id} className="bg-white border border-outline-variant/40 p-6 relative group">
                  <button
                    type="button"
                    onClick={() => handleRemoveTestimonial(testimonial.id, testimonial.isNew)}
                    className="absolute top-4 right-4 text-outline-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="flex flex-col">
                      <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => handleTestimonialChange(testimonial.id, "name", e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={testimonial.city}
                        onChange={(e) => handleTestimonialChange(testimonial.id, "city", e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                        Rating
                      </label>
                      <select
                        value={testimonial.rating}
                        onChange={(e) => handleTestimonialChange(testimonial.id, "rating", Number(e.target.value))}
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <div className="flex flex-col md:col-span-3">
                      <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                        Review
                      </label>
                      <textarea
                        value={testimonial.text}
                        onChange={(e) => handleTestimonialChange(testimonial.id, "text", e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all h-20 resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddTestimonial}
                className="self-start flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-sm text-[10px] uppercase tracking-widest border border-outline-variant/50 px-4 py-2 hover:border-primary"
              >
                <span className="material-symbols-outlined text-[16px]">add</span> Add Testimonial
              </button>
            </div>
          </div>

          {/* 06. About Us Page */}
          <div className="flex flex-col gap-10">
            <div className="flex items-baseline border-b border-outline-variant/50 pb-4">
              <span className="font-newsreader text-sm italic text-on-surface-variant/40 mr-3">06.</span>
              <h3 className="font-headline-h3 text-2xl text-on-surface">About Us Page</h3>
            </div>
            <div className="grid grid-cols-1 gap-y-10">
              <div className="flex flex-col gap-3">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                  About Page Hero Image
                </label>
                <label className="w-full aspect-[21/9] border-2 border-dashed border-outline-variant bg-white flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group relative overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "aboutHeroImage", "banner")}
                  />
                  {formData.aboutHeroImage ? (
                    <img
                      src={formData.aboutHeroImage}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      alt="Hero"
                    />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary mb-2 text-3xl">
                        add_photo_alternate
                      </span>
                      <span className="font-newsreader italic text-sm text-on-surface-variant group-hover:text-primary">
                        Upload wide cinematic image
                      </span>
                    </>
                  )}
                </label>
              </div>
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Store Story / Narrative
                </label>
                <textarea
                  value={formData.storeStory}
                  onChange={(e) => handleInputChange("storeStory", e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all h-40 resize-none"
                ></textarea>
              </div>
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Vision Statement
                </label>
                <input
                  type="text"
                  value={formData.visionStatement}
                  onChange={(e) => handleInputChange("visionStatement", e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-6">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Mission Points
                </label>
                <div className="flex flex-col gap-4">
                  {missionPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-4 group">
                      <span className="font-newsreader italic text-xl text-on-surface-variant/50 shrink-0 w-8">
                        {String(index + 1).padStart(2, "0")}.
                      </span>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const newP = [...missionPoints];
                          newP[index] = e.target.value;
                          setMissionPoints(newP);
                          setIsDirty(true);
                        }}
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newP = [...missionPoints];
                          newP.splice(index, 1);
                          setMissionPoints(newP);
                          setIsDirty(true);
                        }}
                        className="text-outline-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMissionPoints([...missionPoints, ""]);
                    setIsDirty(true);
                  }}
                  className="self-start flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-sm text-[10px] uppercase tracking-widest border border-outline-variant/50 px-4 py-2 hover:border-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> Add Mission Point
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div
        className={`sticky bottom-0 z-40 transition-all duration-500 ease-out ${
          isDirty
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="border-t border-outline-variant/80 bg-[#FAF3E0]/95 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="max-w-[800px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="font-inter text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
                Unsaved changes
              </span>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary text-white font-newsreader uppercase tracking-widest text-xs px-8 py-3 hover:bg-on-surface transition-all duration-300 shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  Saving…
                </>
              ) : (
                "Save All Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
