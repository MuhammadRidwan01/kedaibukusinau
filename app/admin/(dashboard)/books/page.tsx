"use client";

import React, { useState } from "react";

export default function ManageBooksPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mock data
  const books = [
    {
      id: "1",
      title: "The Art of Stillness",
      author: "Marcus Thorne",
      price: 140000,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBR8oxFq1ypyMPZfkhOAqcefhfYMPRBSDcQBTmEk5W-CcgyZ4sfQpY8p-o0V1ruyFsuFjwVzEqUZDD0rfgFusWZdKWzGltaBBdBbOV2NhNioPZYXmqfQycCr-m8-YjEWCSuZpOnrC7Eflv75kgumKgA9JylMi9SdQebj6dHiVLSZYM5_hoxqovPo92CB-F_udlQrSPkhV_7Vd8GXw0qOGbgJ8Qe1aLfzOBb3AxY3nciu6vwgRc_WhZ_U9y8gYX3tiv0OqyuBrk1NjzQ",
      availability: "Unavailable",
      status: "Active"
    },
    {
      id: "2",
      title: "Echoes of the Past",
      author: "Sarah Jenkins",
      price: 110000,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAltnwkDOLQ_vcedkVGnGXmE62gQZ9H24jRhKZxE5OqC8mpBsB-q2uWpxzbhBLbmrlCHTbY9G9A3yvPmECBqXEhpK1ECC1uAD32-WW6KOZYVfA7BSaNqMCv_oCZDXSJ26W3ZtLlrLIFGjYh4YGRlsn_zWgLrIlmYxDoICXgc7EWDeiIGGZUpYBDC45Ankb4KyxEkZUN7HRW6oCyg-b3DKqdjiV7R1DSwkTKQBAwNbHoWuPZ8_SCulwJht13yDgQZdi5v09ql5GNIWqO",
      availability: "Available",
      status: "Active"
    },
    {
      id: "3",
      title: "Whispers in the Wind",
      author: "Elena Rossi",
      price: 125000,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXdtxVvjzntwnPWBLeaFKKgQq6m_ZFSqU3PM-W-mqlXoDshh1kan0FRZoXJMCIOZiK5NEXQLNwKAqiEpaFVvmbSJzmo-0RQpivV5pu9vQTdWU27XIYZa3MDkYKklXPQHpIk5iqmCvsF95h9dCLIJ-iR4HCVQDOUgMNmhTQHtKeqWNZKUuwszivfU6O9_v1rEzhNJgYK9K-mw42NeiayxeGSyAS1XfURwCIFg8DzLLCCTl5E7hYUbFLLO_iUeKqEZ1PxFmwiHtutZ2N",
      availability: "Available",
      status: "Draft"
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header Bar */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center pb-8 border-b border-outline-variant/80 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
            Inventory
          </span>
          <h2 className="font-headline-h2 text-3xl lg:text-4xl text-on-surface italic tracking-tight">
            Manage Books
          </h2>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          {/* Add Book Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-on-surface text-white font-newsreader uppercase tracking-widest text-xs px-6 py-3 hover:bg-primary transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Book
          </button>
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
              placeholder="Search by title, author, or ISBN..."
              className="bg-transparent border-none focus:ring-0 p-0 w-full font-newsreader italic text-lg placeholder-on-surface-variant/50 text-on-surface focus:outline-none"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant shrink-0">
              Filter by:
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
              <option>All Categories</option>
              <option>Fiction</option>
              <option>Non-Fiction</option>
              <option>Architecture</option>
              <option>Design</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-[3rem_4rem_2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-end px-4 py-3 border-b-2 border-outline-variant/80 text-on-surface-variant">
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              No
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest text-center">
              Cover
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              Title
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              Author
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              Price
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              Availability
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
            {books.map((book, index) => (
              <div
                key={book.id}
                className="grid grid-cols-[3rem_4rem_2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-4 border-b border-outline-variant/40 hover:bg-white transition-colors group"
              >
                <span className="font-newsreader text-sm opacity-50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <img
                  alt={book.title}
                  className="w-10 aspect-[2/3] object-cover editorial-inner shadow-sm"
                  src={book.imageUrl}
                />
                <span className="font-headline-h3 text-lg group-hover:text-primary transition-colors truncate">
                  {book.title}
                </span>
                <span className="font-newsreader italic text-on-surface-variant truncate">
                  {book.author}
                </span>
                <span className="font-label-sm text-[12px]">
                  Rp {book.price.toLocaleString("id-ID")}
                </span>
                <div>
                  <span
                    className={`px-2 py-1 font-label-sm text-[9px] uppercase tracking-widest ${
                      book.availability === "Available"
                        ? "bg-[#25D366]/10 text-[#25D366]"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {book.availability}
                  </span>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 border font-label-sm text-[9px] uppercase tracking-widest ${
                      book.status === "Active"
                        ? "border-on-surface-variant text-on-surface-variant"
                        : "border-outline-variant text-outline-variant"
                    }`}
                  >
                    {book.status}
                  </span>
                </div>
                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                  </button>
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
              Showing 1 to 10 of 1,248 entries
            </span>
            <div className="flex gap-4">
              <button className="font-label-sm text-[10px] uppercase tracking-widest text-outline-variant cursor-not-allowed">
                Previous
              </button>
              <div className="flex gap-3 font-newsreader text-sm">
                <span className="text-primary font-bold border-b border-primary">
                  1
                </span>
                <a href="#" className="hover:text-primary">
                  2
                </a>
                <a href="#" className="hover:text-primary">
                  3
                </a>
                <span>...</span>
                <a href="#" className="hover:text-primary">
                  125
                </a>
              </div>
              <a
                href="#"
                className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary"
              >
                Next
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Backdrop */}
      <div
        className={`fixed inset-0 bg-[#1A1A1A]/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isDrawerOpen || isDeleteModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          setIsDrawerOpen(false);
          setIsDeleteModalOpen(false);
        }}
      ></div>

      {/* Right Drawer: Add/Edit Book Form */}
      <div
        className={`fixed top-0 right-0 w-full md:w-[600px] h-full bg-[#FAF3E0] shadow-[-20px_0_40px_rgba(0,0,0,0.1)] z-50 flex flex-col border-l border-outline-variant/60 transform transition-transform duration-400 cubic-bezier(0.25, 1, 0.5, 1) ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-8 border-b border-outline-variant/50">
          <h2 className="font-headline-h2 text-3xl italic">Book Details</h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <form className="flex flex-col gap-8">
            {/* Upload Cover */}
            <div className="flex flex-col gap-3">
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                Book Cover
              </span>
              <div className="w-full h-40 border-2 border-dashed border-outline-variant bg-white flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group">
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary mb-2 text-3xl">
                  add_photo_alternate
                </span>
                <span className="font-newsreader italic text-sm text-on-surface-variant group-hover:text-primary">
                  Click to upload cover image (2:3 ratio)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Common Inputs using Tailwind arbitrary variants for the bottom border styles directly here */}
              <div className="flex flex-col col-span-2">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic placeholder:font-newsreader transition-all duration-300"
                  placeholder="Enter book title"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Author
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic placeholder:font-newsreader transition-all duration-300"
                  placeholder="Author name"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Publisher
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic placeholder:font-newsreader transition-all duration-300"
                  placeholder="Publisher name"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Category
                </label>
                <select className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300 appearance-none rounded-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20fill=%22none%22%20viewBox=%220%200%2024%2024%22%20stroke=%22%231E3A5F%22><path%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20stroke-width=%222%22%20d=%22M19%209l-7%207-7-7%22/></svg>')] bg-no-repeat bg-[position:right_0_center] bg-[length:1em]">
                  <option>Fiction</option>
                  <option>Non-Fiction</option>
                  <option>Design</option>
                  <option>Architecture</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Year
                </label>
                <input
                  type="number"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic placeholder:font-newsreader transition-all duration-300"
                  placeholder="e.g. 2024"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Pages
                </label>
                <input
                  type="number"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic placeholder:font-newsreader transition-all duration-300"
                  placeholder="e.g. 304"
                />
              </div>

              <div className="flex flex-col col-span-2">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic placeholder:font-newsreader transition-all duration-300"
                  placeholder="978-..."
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Price (Rp)
                </label>
                <input
                  type="number"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic placeholder:font-newsreader transition-all duration-300"
                  placeholder="150000"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Original Price (Rp)
                </label>
                <input
                  type="number"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic placeholder:font-newsreader transition-all duration-300"
                  placeholder="195000"
                />
                <span className="font-newsreader text-[11px] italic text-on-surface-variant mt-1 opacity-70">
                  Leave empty if no discount.
                </span>
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Availability
                </label>
                <select className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300 appearance-none rounded-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20fill=%22none%22%20viewBox=%220%200%2024%2024%22%20stroke=%22%231E3A5F%22><path%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20stroke-width=%222%22%20d=%22M19%209l-7%207-7-7%22/></svg>')] bg-no-repeat bg-[position:right_0_center] bg-[length:1em]">
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Badge / Label
                </label>
                <select className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300 appearance-none rounded-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20fill=%22none%22%20viewBox=%220%200%2024%2024%22%20stroke=%22%231E3A5F%22><path%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20stroke-width=%222%22%20d=%22M19%209l-7%207-7-7%22/></svg>')] bg-no-repeat bg-[position:right_0_center] bg-[length:1em]">
                  <option value="none">None</option>
                  <option value="bestseller">Best Seller</option>
                  <option value="new">New Arrival</option>
                  <option value="sale">Sale</option>
                </select>
              </div>

              <div className="flex flex-col col-span-2">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Synopsis
                </label>
                <textarea
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] placeholder:text-on-surface-variant/40 placeholder:italic placeholder:font-newsreader transition-all duration-300 h-32 resize-none"
                  placeholder="Write a brief synopsis..."
                ></textarea>
              </div>

              <div className="flex flex-col col-span-2 pt-4 border-t border-outline-variant/50">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">
                  Publish Status
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      defaultChecked
                      className="text-primary focus:ring-primary bg-transparent border-outline-variant"
                    />
                    <span className="font-newsreader italic text-on-surface group-hover:text-primary transition-colors">
                      Active (Published)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      className="text-primary focus:ring-primary bg-transparent border-outline-variant"
                    />
                    <span className="font-newsreader italic text-on-surface group-hover:text-primary transition-colors">
                      Draft (Hidden)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-8 border-t border-outline-variant/50 flex justify-end gap-4 bg-white">
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="border border-on-surface-variant text-on-surface-variant font-newsreader uppercase tracking-widest text-xs px-6 py-3 hover:bg-surface-variant transition-colors"
          >
            Cancel
          </button>
          <button className="bg-on-surface text-white font-newsreader uppercase tracking-widest text-xs px-8 py-3 hover:bg-primary transition-colors">
            Save Details
          </button>
        </div>
      </div>

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
            warning
          </span>
          <h3 className="font-headline-h3 text-2xl italic text-on-surface">
            Delete Record?
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            Are you sure you want to delete this book? This action cannot be
            undone.
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
