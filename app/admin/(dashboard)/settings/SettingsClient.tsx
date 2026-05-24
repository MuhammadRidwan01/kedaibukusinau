"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  updateSettings,
  createBanner,
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
    setDeletedIds([]);
    setIsDirty(false);
  }, [settings, initialTestimonials]);

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
      <header className="flex flex-col md:flex-row md:justify-between md:items-center pb-8 border-b border-outline-variant/80 shrink-0 bg-[#FAF3E0] z-10 sticky top-0">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
            Global Configuration
          </span>
          <h2 className="font-headline-h2 text-3xl lg:text-4xl text-on-surface italic tracking-tight">
            Store Settings
          </h2>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <button
            type="button"
            disabled={loading}
            onClick={handleSave}
            className="flex items-center gap-2 bg-on-surface text-white font-newsreader uppercase tracking-widest text-xs px-8 py-3 hover:bg-primary transition-all duration-300 shadow-xl shadow-on-surface/10 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto w-full">
        <form
          id="settingsForm"
          className="max-w-[800px] mx-auto py-16 flex flex-col gap-24 pb-32"
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
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                />
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

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {banners?.map((banner: any) => (
                  <div key={banner.id} className="relative group">
                    <img
                      src={banner.imageUrl}
                      className="w-full aspect-[21/9] object-cover grayscale group-hover:grayscale-0 border border-outline-variant/50 transition-all"
                      alt="Banner"
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
    </div>
  );
}
