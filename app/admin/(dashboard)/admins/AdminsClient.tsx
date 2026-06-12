"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { createAdmin, deleteAdmin } from "@/app/admin/actions/admins";
import { useRouter } from "next/navigation";

export function AdminsClient({ admins, currentUserId }: any) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createAdmin(formData);
    if (res.success) {
      toast.success("Admin created successfully");
      setIsDrawerOpen(false);
      setFormData({ name: "", email: "", password: "" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to create admin");
    }
    setLoading(false);
  };

  const handleDeleteClick = (admin: any) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAdmin) return;
    setLoading(true);
    const res = await deleteAdmin(selectedAdmin.id);
    if (res.success) {
      toast.success("Admin deleted successfully");
      setIsDeleteModalOpen(false);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete admin");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center pb-8 border-b border-outline-variant/80 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">Access Control</span>
          <h2 className="font-headline-h2 text-3xl lg:text-4xl text-on-surface italic tracking-tight">Admin Users</h2>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 bg-on-surface text-white font-newsreader uppercase tracking-widest text-xs px-6 py-3 hover:bg-primary transition-all duration-300">
            <span className="material-symbols-outlined text-[18px]">person_add</span> Add Admin
          </button>
        </div>
      </header>

      <div className="flex-1 py-8">
        <div className="w-full max-w-[1000px]">

          {/* ── Desktop Table ── */}
          <div className="hidden md:block">
            <div className="grid grid-cols-[3rem_2fr_2fr_1.5fr_auto] gap-4 items-end px-4 py-3 border-b-2 border-outline-variant/80 text-on-surface-variant">
              <span className="font-label-sm text-[9px] uppercase tracking-widest">No</span>
              <span className="font-label-sm text-[9px] uppercase tracking-widest">Name</span>
              <span className="font-label-sm text-[9px] uppercase tracking-widest">Email</span>
              <span className="font-label-sm text-[9px] uppercase tracking-widest">Created Date</span>
              <span className="font-label-sm text-[9px] uppercase tracking-widest text-right pr-2">Actions</span>
            </div>

            <div className="flex flex-col">
              {admins.map((admin: any, index: number) => {
                const isCurrent = admin.id === currentUserId;
                return (
                  <div key={admin.id} className="grid grid-cols-[3rem_2fr_2fr_1.5fr_auto] gap-4 items-center px-4 py-6 border-b border-outline-variant/40 hover:bg-white transition-colors group">
                    <span className="font-newsreader text-sm opacity-50">{String(index + 1).padStart(2, "0")}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-outline-variant/30 flex items-center justify-center text-on-surface-variant font-headline-h3">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-headline-h3 text-lg group-hover:text-primary transition-colors truncate">{admin.name}</span>
                    </div>
                    <span className="font-newsreader italic text-on-surface-variant truncate">{admin.email}</span>
                    <span className="font-label-sm text-[11px] text-on-surface-variant/70">
                      {new Date(admin.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isCurrent ? (
                        <span className="text-[10px] font-label-sm uppercase tracking-widest text-outline-variant/50 mr-4 self-center">(Current)</span>
                      ) : (
                        <button onClick={() => handleDeleteClick(admin)} className="text-on-surface-variant hover:text-primary transition-colors" title="Delete">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Mobile Card List ── */}
          <div className="md:hidden flex flex-col gap-3">
            {admins.map((admin: any, index: number) => {
              const isCurrent = admin.id === currentUserId;
              return (
                <div key={admin.id} className="bg-white border border-outline-variant/40 p-4 flex gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-outline-variant/30 flex items-center justify-center text-on-surface-variant font-headline-h3 shrink-0">
                    {admin.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-h3 text-base truncate">{admin.name}</h3>
                      {isCurrent && (
                        <span className="text-[9px] font-label-sm uppercase tracking-widest text-outline-variant/60 shrink-0">(You)</span>
                      )}
                    </div>
                    <span className="font-newsreader italic text-sm text-on-surface-variant truncate">{admin.email}</span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant/60">
                      {new Date(admin.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    {!isCurrent && (
                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-outline-variant/30">
                        <button onClick={() => handleDeleteClick(admin)} className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors" title="Delete">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          <span className="font-label-sm text-[9px] uppercase tracking-widest">Remove</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-[#1A1A1A]/30 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full md:w-[450px] bg-[#FAF3E0] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <header className="flex justify-between items-center p-6 md:p-8 border-b border-outline-variant shrink-0">
              <h2 className="font-headline-h2 text-2xl md:text-3xl italic">New Curator</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <form id="admin-form" onSubmit={handleSave} className="flex flex-col gap-10">
                <p className="font-newsreader italic text-sm text-on-surface-variant leading-relaxed">Grant administrative privileges to a new team member. They will have access to manage books, write articles, and configure store settings.</p>
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col">
                    <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Full Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300" placeholder="Enter curator's name" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Email Address</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300" placeholder="name@kedaisinau.com" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Temporary Password</label>
                    <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-inter text-sm text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#C0392B] transition-all duration-300" placeholder="Minimum 8 characters" />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 md:p-8 border-t border-outline-variant bg-[#FAF3E0] flex flex-col gap-4 shrink-0">
              <button type="submit" form="admin-form" disabled={loading} className="w-full bg-primary text-white font-newsreader uppercase tracking-widest text-xs py-4 hover:bg-on-surface transition-colors shadow-lg shadow-primary/20 disabled:opacity-50">Create Admin Account</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1A1A1A]/30 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white border border-outline-variant p-6 md:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline-h3 text-2xl italic text-primary mb-4">Revoke Access?</h3>
            <p className="font-inter text-on-surface-variant mb-8">Are you sure you want to remove <strong className="text-on-surface">{selectedAdmin?.name}</strong>? They will immediately lose access to the dashboard.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="border border-outline text-outline font-newsreader uppercase tracking-widest text-xs px-6 py-2.5 hover:bg-[#FAF3E0] transition-colors">Cancel</button>
              <button onClick={confirmDelete} disabled={loading} className="bg-primary text-white font-newsreader uppercase tracking-widest text-xs px-6 py-2.5 hover:bg-on-surface transition-colors">Yes, Revoke</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
