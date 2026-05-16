"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ManageArticlesPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mock data
  const articles = [
    {
      id: "1",
      title: "The Modern Return to Minimalist Literature",
      category: "Featured",
      date: "May 12, 2026",
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
      status: "Published"
    },
    {
      id: "2",
      title: "A Conversation with Sally Rooney",
      category: "Interview",
      date: "May 05, 2026",
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
      status: "Published"
    },
    {
      id: "3",
      title: "Review: Echoes of the Past by Sarah Jenkins",
      category: "Book Review",
      date: "Apr 28, 2026",
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
      status: "Draft"
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header Bar */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center pb-8 border-b border-outline-variant/80 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
            Editorial Journal
          </span>
          <h2 className="font-headline-h2 text-3xl lg:text-4xl text-on-surface italic tracking-tight">
            Manage Articles
          </h2>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          {/* Write Article Button */}
          <Link
            href="/admin/articles/editor"
            className="flex items-center gap-2 bg-on-surface text-white font-newsreader uppercase tracking-widest text-xs px-6 py-3 hover:bg-primary transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[18px]">
              edit_document
            </span>
            Write Article
          </Link>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 py-8">
        {/* Toolbar: Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          {/* Search */}
          <div className="flex items-end gap-2 border-b border-outline-variant pb-1 w-full md:w-96">
            <span className="material-symbols-outlined font-light text-on-surface-variant text-[20px] mb-0.5">
              search
            </span>
            <input
              type="text"
              placeholder="Search by article title..."
              className="bg-transparent border-none focus:ring-0 p-0 w-full font-newsreader italic text-lg placeholder-on-surface-variant/50 text-on-surface focus:outline-none"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant shrink-0">
              Status:
            </span>
            <select
              className="bg-transparent border-b border-outline-variant py-1 pr-8 font-newsreader text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml;utf8,<svg fill=%22none%22 stroke=%22%231A1A1A%22 stroke-width=%222%22 viewBox=%220 0 24 24%22 xmlns=%22http://www.w3.org/2000/svg%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M19 9l-7 7-7-7%22></path></svg>')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right center",
                backgroundSize: "16px",
              }}
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-[3rem_6rem_2.5fr_1fr_1fr_1fr_auto] gap-4 items-end px-4 py-3 border-b-2 border-outline-variant/80 text-on-surface-variant">
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              No
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest text-center">
              Thumb
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              Title
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              Category
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              Date
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              Status
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest text-right pr-2">
              Actions
            </span>
          </div>

          {/* Table Body */}
          <div className="flex flex-col">
            {articles.map((article, index) => (
              <div
                key={article.id}
                className="grid grid-cols-[3rem_6rem_2.5fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-4 border-b border-outline-variant/40 hover:bg-white transition-colors group"
              >
                <span className="font-newsreader text-sm opacity-50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <img
                  alt="Thumbnail"
                  className="w-16 aspect-video object-cover editorial-inner shadow-sm grayscale"
                  src={article.imageUrl}
                />
                <span className="font-headline-h3 text-lg group-hover:text-primary transition-colors truncate">
                  {article.title}
                </span>
                <span className="font-newsreader italic text-on-surface-variant truncate">
                  {article.category}
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant/70">
                  {article.date}
                </span>
                <div>
                  <span
                    className={`px-2 py-1 font-label-sm text-[9px] uppercase tracking-widest ${
                      article.status === "Published"
                        ? "bg-[#25D366]/10 text-[#25D366]"
                        : "border border-outline-variant text-outline-variant"
                    }`}
                  >
                    {article.status}
                  </span>
                </div>
                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href="/admin/articles/editor"
                    className="text-on-surface-variant hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8 px-4">
            <span className="font-newsreader italic text-sm text-on-surface-variant">
              Showing 1 to 10 of 86 entries
            </span>
            <div className="flex gap-4">
              <button className="font-label-sm text-[10px] uppercase tracking-widest text-outline-variant cursor-not-allowed">
                Previous
              </button>
              <div className="flex gap-3 font-newsreader text-sm">
                <span className="text-primary font-bold border-b border-primary">
                  1
                </span>
                <Link href="#" className="hover:text-primary">
                  2
                </Link>
                <Link href="#" className="hover:text-primary">
                  3
                </Link>
                <span>...</span>
                <Link href="#" className="hover:text-primary">
                  9
                </Link>
              </div>
              <Link
                href="#"
                className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary"
              >
                Next
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Backdrop */}
      <div
        className={`fixed inset-0 bg-[#1A1A1A]/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isDeleteModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDeleteModalOpen(false)}
      ></div>

      {/* Centered Modal: Confirm Delete */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white border border-outline-variant shadow-2xl z-50 flex flex-col transition-opacity duration-300 ${
          isDeleteModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-8 flex flex-col items-center text-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl mb-2">
            delete_forever
          </span>
          <h3 className="font-headline-h3 text-2xl italic text-on-surface">
            Delete Article?
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            Are you sure you want to delete this article permanently? This cannot
            be undone.
          </p>
        </div>
        <div className="flex border-t border-outline-variant/50">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="flex-1 py-4 font-newsreader uppercase tracking-widest text-xs text-on-surface border-r border-outline-variant/50 hover:bg-[#FAF3E0] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="flex-1 py-4 font-newsreader uppercase tracking-widest text-xs text-primary hover:bg-[#FAF3E0] transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
