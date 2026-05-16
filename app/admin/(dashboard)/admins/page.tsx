"use client";

import React, { useState } from "react";

export default function ManageAdminsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mock data
  const admins = [
    {
      id: "1",
      name: "Widhyanto Muttaqien Ahmad",
      initials: "W",
      email: "widhyanto@kedaisinau.com",
      createdDate: "Jan 12, 2024",
      isCurrent: true,
    },
    {
      id: "2",
      name: "Aida Saskia",
      initials: "A",
      email: "aida@kedaisinau.com",
      createdDate: "Mar 05, 2024",
      isCurrent: false,
    },
    {
      id: "3",
      name: "Reza Rahadian",
      initials: "R",
      email: "reza@kedaisinau.com",
      createdDate: "Apr 22, 2024",
      isCurrent: false,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header Bar */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center pb-8 border-b border-outline-variant/80 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
            Access Control
          </span>
          <h2 className="font-headline-h2 text-3xl lg:text-4xl text-on-surface italic tracking-tight">
            Admin Users
          </h2>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          {/* Add Admin Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-on-surface text-white font-newsreader uppercase tracking-widest text-xs px-6 py-3 hover:bg-primary transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[18px]">
              person_add
            </span>
            Add Admin
          </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 py-8">
        {/* Table */}
        <div className="w-full max-w-[1000px]">
          {/* Table Header */}
          <div className="grid grid-cols-[3rem_2fr_2fr_1.5fr_auto] gap-4 items-end px-4 py-3 border-b-2 border-outline-variant/80 text-on-surface-variant">
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              No
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              Name
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              Email
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">
              Created Date
            </span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest text-right pr-2">
              Actions
            </span>
          </div>

          {/* Table Body */}
          <div className="flex flex-col">
            {admins.map((admin, index) => (
              <div
                key={admin.id}
                className="grid grid-cols-[3rem_2fr_2fr_1.5fr_auto] gap-4 items-center px-4 py-6 border-b border-outline-variant/40 hover:bg-white transition-colors group"
              >
                <span className="font-newsreader text-sm opacity-50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-outline-variant/30 flex items-center justify-center text-on-surface-variant font-headline-h3">
                    {admin.initials}
                  </div>
                  <span className="font-headline-h3 text-lg group-hover:text-primary transition-colors truncate">
                    {admin.name}
                  </span>
                </div>
                <span className="font-newsreader italic text-on-surface-variant truncate">
                  {admin.email}
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant/70">
                  {admin.createdDate}
                </span>
                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {admin.isCurrent ? (
                    <span className="text-[10px] font-label-sm uppercase tracking-widest text-outline-variant/50 mr-4 self-center">
                      (Current)
                    </span>
                  ) : (
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="text-on-surface-variant hover:text-primary transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        delete
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
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

      {/* Right Drawer: Add Admin Form */}
      <div
        className={`fixed top-0 right-0 w-full md:w-[450px] h-full bg-[#FAF3E0] shadow-[-20px_0_40px_rgba(0,0,0,0.1)] z-50 flex flex-col border-l border-outline-variant/60 transform transition-transform duration-400 cubic-bezier(0.25, 1, 0.5, 1) ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-8 border-b border-outline-variant/50">
          <h2 className="font-headline-h2 text-3xl italic">New Curator</h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <form className="flex flex-col gap-10">
            {/* Intro Text */}
            <p className="font-newsreader italic text-sm text-on-surface-variant leading-relaxed">
              Grant administrative privileges to a new team member. They will
              have access to manage books, write articles, and configure store
              settings.
            </p>

            <div className="flex flex-col gap-8">
              {/* Name */}
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                  placeholder="Enter curator's name"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                  placeholder="name@kedaisinau.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300"
                  placeholder="Create a secure password"
                  required
                />
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
            Save Admin
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
            person_remove
          </span>
          <h3 className="font-headline-h3 text-2xl italic text-on-surface">
            Revoke Access?
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            Are you sure you want to delete this admin account? They will lose
            all access to the panel immediately.
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
