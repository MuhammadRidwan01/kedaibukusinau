"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { updateMetadata, deleteMetadata, getMetadata } from "@/app/admin/actions/metadata";

type TabType = "author" | "publisher" | "category" | "genre";

interface MetadataItem {
  id: number;
  name: string;
  _count: { books: number };
}

interface BookDetail {
  id: number;
  title: string;
  imageUrl: string | null;
}

export function MetadataClient({
  initialAuthors,
  initialPublishers,
  initialCategories,
  initialGenres,
}: {
  initialAuthors: MetadataItem[];
  initialPublishers: MetadataItem[];
  initialCategories: MetadataItem[];
  initialGenres: MetadataItem[];
}) {
  const [activeTab, setActiveTab] = useState<TabType>("author");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    author: initialAuthors,
    publisher: initialPublishers,
    category: initialCategories,
    genre: initialGenres,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MetadataItem | null>(null);

  // Lazy load state
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [booksData, setBooksData] = useState<Record<number, { loading: boolean; books: BookDetail[] }>>({});

  const refreshData = async (type: TabType) => {
    const res = await getMetadata(type);
    if (res.success) {
      setData((prev) => ({ ...prev, [type]: res.data }));
    }
  };

  const startEdit = (item: MetadataItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setExpandedId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (id: number) => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setLoading(true);
    const res = await updateMetadata(activeTab, id, editName.trim());
    if (res.success) {
      toast.success("Successfully updated");
      setEditingId(null);
      await refreshData(activeTab);
    } else {
      toast.error(res.error || "Failed to update");
    }
    setLoading(false);
  };

  const handleDelete = (item: MetadataItem) => {
    if (item._count.books > 0) {
      toast.error(`Cannot delete. Still used by ${item._count.books} book(s).`);
      return;
    }

    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setLoading(true);
    const res = await deleteMetadata(activeTab, itemToDelete.id);
    if (res.success) {
      toast.success("Successfully deleted");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      await refreshData(activeTab);
      if (expandedId === itemToDelete.id) setExpandedId(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
    setLoading(false);
  };

  const toggleExpand = async (item: MetadataItem) => {
    if (editingId === item.id) return; // Disable toggle while editing
    if (item._count.books === 0) return; // Nothing to show

    if (expandedId === item.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(item.id);

    // Fetch if not cached
    if (!booksData[item.id]) {
      setBooksData(prev => ({ ...prev, [item.id]: { loading: true, books: [] } }));
      try {
        const res = await fetch(`/api/admin/entities/${activeTab}/${item.id}/books`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setBooksData(prev => ({ ...prev, [item.id]: { loading: false, books: json.books || [] } }));
      } catch (error) {
        toast.error("Failed to load books");
        setBooksData(prev => ({ ...prev, [item.id]: { loading: false, books: [] } }));
      }
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "author", label: "Authors" },
    { id: "publisher", label: "Publishers" },
    { id: "category", label: "Categories" },
    { id: "genre", label: "Genres" },
  ];

  const currentData = data[activeTab];

  return (
    <div className="flex flex-col h-full px-2">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end pb-8 border-b border-outline-variant/80 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
            The Registry
          </span>
          <h2 className="font-headline-h2 text-3xl lg:text-4xl text-on-surface italic tracking-tight">
            Manage Metadata
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-6 md:mt-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditingId(null);
                setExpandedId(null);
              }}
              className={`font-label-sm uppercase tracking-widest text-[9px] px-5 py-2.5 rounded-full transition-all duration-300 ${activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-transparent text-on-surface-variant border border-outline-variant/60 hover:border-primary/50 hover:text-primary"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 py-8 relative">
        <div className="flex flex-col relative pb-32">
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-[2px] transition-all duration-500">
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {currentData.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center opacity-0 animate-in fade-in duration-1000">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-6 font-light">
                category
              </span>
              <span className="font-newsreader italic text-3xl md:text-4xl text-on-surface-variant/50">
                The registry is bare.
              </span>
              <p className="font-inter text-xs uppercase tracking-widest text-on-surface-variant/40 mt-4">
                No {activeTab}s found in the database.
              </p>
            </div>
          ) : (
            currentData.map((item, index) => {
              const isExpanded = expandedId === item.id;
              const itemBooks = booksData[item.id];

              return (
                <div
                  key={item.id}
                  className={`group relative border-b border-outline-variant/20 flex flex-col transition-all duration-500 animate-in slide-in-from-bottom-4 fade-in ${isExpanded ? "py-8 md:py-10 bg-surface-variant/5 px-4 md:px-8 -mx-4 md:-mx-8 rounded-2xl border-transparent" : "py-6 md:py-6 hover:bg-surface-variant/5 hover:px-4 -mx-4"
                    }`}
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                    {/* Name / Edit Input */}
                    <div className="flex-1 w-full min-w-0">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-4 w-full">
                          <input
                            type="text"
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(item.id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="w-full bg-transparent border-0 border-b border-primary py-1 font-newsreader italic text-3xl md:text-4xl text-primary focus:ring-0 placeholder-primary/20 outline-none transition-all"
                            placeholder="Enter name..."
                          />
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => saveEdit(item.id)} className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all duration-300">
                              <span className="material-symbols-outlined text-[18px] font-light">check</span>
                            </button>
                            <button onClick={cancelEdit} className="w-10 h-10 rounded-full bg-on-surface-variant/10 text-on-surface-variant flex items-center justify-center hover:bg-on-surface hover:text-white transition-all duration-300">
                              <span className="material-symbols-outlined text-[18px] font-light">close</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`flex items-baseline flex-wrap gap-x-4 gap-y-1 ${item._count.books > 0 ? 'cursor-pointer' : 'cursor-default'}`}
                          onClick={() => toggleExpand(item)}
                        >
                          <span className={`font-newsreader italic text-2xl md:text-3xl lg:text-4xl tracking-tight truncate transition-colors duration-500 ${isExpanded ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                            {item.name}
                          </span>
                          <span className={`font-inter text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 translate-y-[-2px] shrink-0 flex items-center gap-1 ${isExpanded ? 'text-primary/70' : 'text-on-surface-variant/50 group-hover:text-primary/60'}`}>
                            {item._count.books} {item._count.books === 1 ? 'Volume' : 'Volumes'}
                            {item._count.books > 0 && (
                              <span className={`material-symbols-outlined text-[14px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                expand_more
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {!editingId && (
                      <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:translate-y-2 md:group-hover:translate-y-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); startEdit(item); }}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all duration-300" title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px] font-light">edit</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${item._count.books > 0 ? "text-outline-variant cursor-not-allowed" : "text-on-surface-variant hover:bg-red-500/10 hover:text-red-600"}`}
                          title={item._count.books > 0 ? "Cannot delete while linked to books" : "Delete"}
                          disabled={item._count.books > 0}
                        >
                          <span className="material-symbols-outlined text-[18px] font-light">delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="mt-8 animate-in slide-in-from-top-4 fade-in duration-500">
                      {itemBooks?.loading ? (
                        <div className="flex items-center gap-3 text-on-surface-variant/50 font-inter text-xs uppercase tracking-widest">
                          <div className="w-4 h-4 border-2 border-primary/50 border-t-transparent rounded-full animate-spin"></div>
                          Retrieving archive...
                        </div>
                      ) : (
                        <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
                          {itemBooks?.books.map(book => (
                            <div key={book.id} className="snap-start shrink-0 w-24 md:w-32 flex flex-col gap-3 group/book">
                              <div className="w-full aspect-[2/3] bg-surface-variant/30 rounded-md overflow-hidden relative border border-outline-variant/20 group-hover/book:border-primary/30 transition-colors shadow-sm">
                                {book.imageUrl ? (
                                  <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/book:scale-110" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-on-surface-variant/30">
                                    <span className="material-symbols-outlined text-2xl mb-1 font-light">menu_book</span>
                                  </div>
                                )}
                              </div>
                              <span className="font-newsreader italic text-sm md:text-base text-on-surface leading-tight line-clamp-2 group-hover/book:text-primary transition-colors">
                                {book.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white border border-outline-variant p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline-h3 text-2xl italic text-primary mb-4">Delete Entry?</h3>
            <p className="font-inter text-on-surface-variant mb-8">Are you sure you want to delete <strong className="text-on-surface">{itemToDelete?.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="border border-outline text-outline font-newsreader uppercase tracking-widest text-xs px-6 py-2.5 hover:bg-[#FAF3E0] transition-colors">Cancel</button>
              <button onClick={confirmDelete} disabled={loading} className="bg-primary text-white font-newsreader uppercase tracking-widest text-xs px-6 py-2.5 hover:bg-on-surface transition-colors">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
