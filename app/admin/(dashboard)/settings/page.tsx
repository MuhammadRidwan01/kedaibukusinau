"use client";

import React, { useState } from "react";

export default function StoreSettingsPage() {
  const [missionPoints, setMissionPoints] = useState([
    "Sell books that are carefully selected for their quality.",
    "Provide a comfortable and quiet physical space for reading.",
    "Support local and independent authors.",
  ]);

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Aisyah Putri",
      city: "Jakarta",
      rating: "5",
      text: "Koleksi bukunya sangat berkualitas. Setiap rekomendasi selalu tepat sasaran dan pengiriman sangat cepat!",
    },
    {
      id: 2,
      name: "Rizky Pratama",
      city: "Bandung",
      rating: "5",
      text: "Toko buku favorit saya! Pelayanan ramah dan selalu ada buku-buku yang sulit ditemukan di tempat lain.",
    },
    {
      id: 3,
      name: "Dewi Lestari",
      city: "Surabaya",
      rating: "5",
      text: "Senang bisa menemukan toko buku dengan kurasi yang bagus. Buku selalu dalam kondisi perfect.",
    },
  ]);

  const handleRemoveMissionPoint = (index: number) => {
    const newPoints = [...missionPoints];
    newPoints.splice(index, 1);
    setMissionPoints(newPoints);
  };

  const handleAddMissionPoint = () => {
    setMissionPoints([...missionPoints, ""]);
  };

  const handleUpdateMissionPoint = (index: number, value: string) => {
    const newPoints = [...missionPoints];
    newPoints[index] = value;
    setMissionPoints(newPoints);
  };

  const handleRemoveTestimonial = (id: number) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Bar */}
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
          {/* Save Button */}
          <button
            type="submit"
            form="settingsForm"
            className="flex items-center gap-2 bg-on-surface text-white font-newsreader uppercase tracking-widest text-xs px-8 py-3 hover:bg-primary transition-all duration-300 shadow-xl shadow-on-surface/10"
          >
            Save Changes
          </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto w-full">
        <form
          id="settingsForm"
          className="max-w-[800px] mx-auto py-16 flex flex-col gap-24 pb-32"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Section: Store Identity */}
          <div className="flex flex-col gap-10">
            <div className="flex items-baseline border-b border-outline-variant/50 pb-4">
              <span className="font-newsreader text-sm italic text-on-surface-variant/40 mr-3">
                01.
              </span>
              <h3 className="font-headline-h3 text-2xl text-on-surface">
                Store Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="flex flex-col md:col-span-2">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-newsreader font-medium text-xl text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                  defaultValue="Kedai Sinau."
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Brief Description
                </label>
                <textarea
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300 h-24 resize-none"
                  placeholder="Enter a brief manifesto or description..."
                  defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                ></textarea>
              </div>

              <div className="flex flex-col md:col-span-2 gap-3">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Brand Logo
                </label>
                <div className="w-full h-32 border-2 border-dashed border-outline-variant bg-white flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group">
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary mb-2 text-2xl">
                    upload_file
                  </span>
                  <span className="font-newsreader italic text-sm text-on-surface-variant group-hover:text-primary">
                    Click to upload SVG or transparent PNG
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Contact Info */}
          <div className="flex flex-col gap-10">
            <div className="flex items-baseline border-b border-outline-variant/50 pb-4">
              <span className="font-newsreader text-sm italic text-on-surface-variant/40 mr-3">
                02.
              </span>
              <h3 className="font-headline-h3 text-2xl text-on-surface">
                Contact Info
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                  defaultValue="+6281234567890"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                  defaultValue="hello@kedaisinau.com"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Full Address
                </label>
                <textarea
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300 h-20 resize-none"
                  placeholder="Enter complete physical address..."
                  defaultValue="Jalan Literasi No. 12, Kecamatan Ilmu, Kota Pengetahuan, 12345"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section: Social Media */}
          <div className="flex flex-col gap-10">
            <div className="flex items-baseline border-b border-outline-variant/50 pb-4">
              <span className="font-newsreader text-sm italic text-on-surface-variant/40 mr-3">
                03.
              </span>
              <h3 className="font-headline-h3 text-2xl text-on-surface">
                Social Media
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Instagram Link
                </label>
                <input
                  type="url"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                  placeholder="https://instagram.com/..."
                  defaultValue="https://instagram.com/kedaisinau"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Shopee Link
                </label>
                <input
                  type="url"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                  placeholder="https://shopee.co.id/..."
                  defaultValue="https://shopee.co.id/kedaisinau"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  TikTok Link
                </label>
                <input
                  type="url"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                  placeholder="https://tiktok.com/@..."
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Facebook Link
                </label>
                <input
                  type="url"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
          </div>

          {/* Section: Homepage Banner */}
          <div className="flex flex-col gap-10">
            <div className="flex items-baseline border-b border-outline-variant/50 pb-4">
              <span className="font-newsreader text-sm italic text-on-surface-variant/40 mr-3">
                04.
              </span>
              <h3 className="font-headline-h3 text-2xl text-on-surface">
                Homepage Banner
              </h3>
            </div>

            <div className="flex flex-col gap-8">
              <p className="font-newsreader italic text-sm text-on-surface-variant">
                Upload images for the main hero carousel on the landing page. We
                recommend wide, cinematic formats (e.g. 1920x600).
              </p>

              {/* Upload Banner */}
              <div className="w-full aspect-[21/9] border-2 border-dashed border-outline-variant bg-white flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group relative overflow-hidden">
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary mb-2 text-3xl">
                  add_photo_alternate
                </span>
                <span className="font-newsreader italic text-sm text-on-surface-variant group-hover:text-primary">
                  Click to add new carousel slide
                </span>
              </div>

              {/* Existing Banners */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop"
                    className="w-full aspect-[21/9] object-cover grayscale border border-outline-variant/50"
                    alt="Banner 1"
                  />
                  <div className="absolute inset-0 bg-[#1A1A1A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                      type="button"
                      className="text-white hover:text-primary transition-colors"
                      title="Delete Slide"
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
                <div className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop"
                    className="w-full aspect-[21/9] object-cover grayscale border border-outline-variant/50"
                    alt="Banner 2"
                  />
                  <div className="absolute inset-0 bg-[#1A1A1A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                      type="button"
                      className="text-white hover:text-primary transition-colors"
                      title="Delete Slide"
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Testimonials */}
          <div className="flex flex-col gap-10">
            <div className="flex items-baseline border-b border-outline-variant/50 pb-4">
              <span className="font-newsreader text-sm italic text-on-surface-variant/40 mr-3">
                05.
              </span>
              <h3 className="font-headline-h3 text-2xl text-on-surface">
                Testimonials
              </h3>
            </div>

            <p className="font-newsreader italic text-sm text-on-surface-variant">
              Manage customer reviews displayed on the homepage. Maximum 3
              testimonials for visual balance.
            </p>

            <div className="flex flex-col gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white border border-outline-variant/40 p-6 relative group"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveTestimonial(testimonial.id)}
                    className="absolute top-4 right-4 text-outline-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      close
                    </span>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col">
                      <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                        defaultValue={testimonial.name}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                        defaultValue={testimonial.city}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                        Rating
                      </label>
                      <select
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300 appearance-none rounded-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20fill=%22none%22%20viewBox=%220%200%2024%2024%22%20stroke=%22%231E3A5F%22><path%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20stroke-width=%222%22%20d=%22M19%209l-7%207-7-7%22/></svg>')] bg-no-repeat bg-[position:right_0_center] bg-[length:1em]"
                        defaultValue={testimonial.rating}
                      >
                        <option value="5">★★★★★ (5)</option>
                        <option value="4">★★★★☆ (4)</option>
                        <option value="3">★★★☆☆ (3)</option>
                      </select>
                    </div>
                    <div className="flex flex-col md:col-span-2">
                      <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                        Testimonial Text
                      </label>
                      <textarea
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300 h-20 resize-none"
                        defaultValue={testimonial.text}
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: About Us */}
          <div className="flex flex-col gap-10">
            <div className="flex items-baseline border-b border-outline-variant/50 pb-4">
              <span className="font-newsreader text-sm italic text-on-surface-variant/40 mr-3">
                06.
              </span>
              <h3 className="font-headline-h3 text-2xl text-on-surface">
                About Us Page
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-y-10">
              <div className="flex flex-col gap-3">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                  About Page Hero Image
                </label>
                <div className="w-full aspect-[21/9] border-2 border-dashed border-outline-variant bg-white flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group relative overflow-hidden">
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary mb-2 text-3xl">
                    add_photo_alternate
                  </span>
                  <span className="font-newsreader italic text-sm text-on-surface-variant group-hover:text-primary">
                    Upload wide cinematic image (e.g. bookstore interior)
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Store Story / Narrative
                </label>
                <textarea
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300 h-40 resize-none"
                  placeholder="Tell the story behind the bookstore..."
                  defaultValue="Kedai Sinau started in 2018 as a small shop in a quiet neighborhood. We wanted to build a physical space where people can easily find books that matter to them, away from the noise of large retail chains.

We read and select every title we sell. We focus on contemporary fiction, non-fiction, and poetry that we genuinely believe are worth your time. Our goal is simple: to connect good books with the people who want to read them."
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Vision Statement
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                  defaultValue="To build a space where readers can easily discover high-quality literature and connect with others who share their interests."
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
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                        value={point}
                        onChange={(e) =>
                          handleUpdateMissionPoint(index, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMissionPoint(index)}
                        className="text-outline-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                        title="Remove"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddMissionPoint}
                  className="self-start flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-sm text-[10px] uppercase tracking-widest border border-outline-variant/50 px-4 py-2 hover:border-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add
                  </span>
                  Add Mission Point
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
