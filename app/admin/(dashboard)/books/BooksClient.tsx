"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { getBooks, createBook, updateBook, deleteBook } from "@/app/admin/actions/books";
import { Combobox } from "@/components/admin/Combobox";

export function BooksClient({ initialBooks, initialTotal, initialPage, initialTotalPages, categories }: any) {
  const [books, setBooks] = useState(initialBooks);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState<any>({
    title: "", authorName: "", publisherName: "", categoryName: "", 
    isbn: "", year: "", pages: "", price: "", originalPrice: "", 
    availability: "Available", status: "Active", isFeaturedBestseller: false,
    synopsis: "", badge: "", imageUrl: "", genreNames: []
  });
  
  const fetchBooks = useCallback(async (p: number, q: string, cat?: number) => {
    setLoading(true);
    const res = await getBooks({ page: p, q, categoryId: cat });
    if (res.success) {
      setBooks(res.books);
      setTotal(res.total);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } else {
      toast.error(res.error || "Failed to load books");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks(1, search, filterCategory);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, filterCategory, fetchBooks]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchBooks(newPage, search, filterCategory);
  };

  const handleOpenDrawer = (book?: any) => {
    if (book) {
      setSelectedBook(book);
      setFormData({
        title: book.title || "",
        authorName: book.author?.name || "",
        publisherName: book.publisher?.name || "",
        categoryName: book.category?.name || "",
        isbn: book.isbn || "",
        year: book.year || "",
        pages: book.pages || "",
        price: book.price || "",
        originalPrice: book.originalPrice || "",
        availability: book.availability || "Available",
        status: book.status || "Active",
        isFeaturedBestseller: book.isFeaturedBestseller || false,
        synopsis: book.synopsis || "",
        badge: book.badge || "",
        imageUrl: book.imageUrl || "",
        genreNames: book.genres?.map((g: any) => g.genre.name) || [],
      });
    } else {
      setSelectedBook(null);
      setFormData({
        title: "", authorName: "", publisherName: "", categoryName: "", 
        isbn: "", year: "", pages: "", price: "", originalPrice: "", 
        availability: "Available", status: "Active", isFeaturedBestseller: false,
        synopsis: "", badge: "", imageUrl: "", genreNames: []
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = selectedBook 
      ? await updateBook(selectedBook.id, formData)
      : await createBook(formData);
      
    if (res.success) {
      toast.success(`Book successfully ${selectedBook ? "updated" : "added"}`);
      setIsDrawerOpen(false);
      fetchBooks(page, search, filterCategory);
    } else {
      toast.error(res.error || "Operation failed");
    }
    setLoading(false);
  };

  const handleDeleteClick = (book: any) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBook) return;
    setLoading(true);
    const res = await deleteBook(selectedBook.id);
    if (res.success) {
      toast.success("Book deleted successfully");
      setIsDeleteModalOpen(false);
      fetchBooks(page, search, filterCategory);
    } else {
      toast.error(res.error || "Failed to delete book");
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const data = new FormData();
    data.append("file", file);
    
    toast.loading("Uploading image...", { id: "upload" });
    try {
      const res = await fetch("/api/upload?type=book", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok) {
        setFormData({ ...formData, imageUrl: json.url });
        toast.success("Image uploaded", { id: "upload" });
      } else {
        toast.error(json.error || "Upload failed", { id: "upload" });
      }
    } catch (err) {
      toast.error("Upload error", { id: "upload" });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center pb-8 border-b border-outline-variant/80 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">Inventory</span>
          <h2 className="font-headline-h2 text-3xl lg:text-4xl text-on-surface italic tracking-tight">Manage Books</h2>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <button
            onClick={() => handleOpenDrawer()}
            className="flex items-center gap-2 bg-on-surface text-white font-newsreader uppercase tracking-widest text-xs px-6 py-3 hover:bg-primary transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Add Book
          </button>
        </div>
      </header>

      <div className="flex-1 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="flex items-end gap-2 border-b border-outline-variant pb-1 w-full md:w-96">
            <span className="material-symbols-outlined font-light text-on-surface-variant text-[20px] mb-0.5">search</span>
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 p-0 w-full font-newsreader italic text-lg placeholder-on-surface-variant/50 text-on-surface focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant shrink-0">Filter by:</span>
            <select
              value={filterCategory || ""}
              onChange={(e) => setFilterCategory(e.target.value ? Number(e.target.value) : undefined)}
              className="bg-transparent border-b border-outline-variant py-1 pr-8 font-newsreader text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="w-full relative">
          {loading && <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">Loading...</div>}
          <div className="grid grid-cols-[3rem_4rem_2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-end px-4 py-3 border-b-2 border-outline-variant/80 text-on-surface-variant">
            <span className="font-label-sm text-[9px] uppercase tracking-widest">No</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest text-center">Cover</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">Title</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">Author</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">Price</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">Availability</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">Status</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest text-right pr-2">Actions</span>
          </div>

          <div className="flex flex-col">
            {books.length === 0 ? (
              <div className="py-8 text-center text-on-surface-variant italic font-newsreader">No books found.</div>
            ) : (
              books.map((book: any, index: number) => (
                <div key={book.id} className="grid grid-cols-[3rem_4rem_2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-4 border-b border-outline-variant/40 hover:bg-white transition-colors group">
                  <span className="font-newsreader text-sm opacity-50">{String((page - 1) * 20 + index + 1).padStart(2, "0")}</span>
                  <img alt={book.title} className="w-10 aspect-[2/3] object-cover editorial-inner shadow-sm bg-surface-variant" src={book.imageUrl || 'https://via.placeholder.com/150'} />
                  <span className="font-headline-h3 text-lg group-hover:text-primary transition-colors truncate">{book.title}</span>
                  <span className="font-newsreader italic text-on-surface-variant truncate">{book.author?.name || "-"}</span>
                  <span className="font-label-sm text-[12px]">Rp {book.price.toLocaleString("id-ID")}</span>
                  <div>
                    <span className={`px-2 py-1 font-label-sm text-[9px] uppercase tracking-widest ${book.availability === "Available" ? "bg-[#25D366]/10 text-[#25D366]" : "bg-primary/10 text-primary"}`}>
                      {book.availability}
                    </span>
                  </div>
                  <div>
                    <span className={`px-2 py-1 border font-label-sm text-[9px] uppercase tracking-widest ${book.status === "Active" ? "border-on-surface-variant text-on-surface-variant" : "border-outline-variant text-outline-variant"}`}>
                      {book.status}
                    </span>
                  </div>
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenDrawer(book)} className="text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button onClick={() => handleDeleteClick(book)} className="text-on-surface-variant hover:text-primary transition-colors" title="Delete">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button disabled={page === 1} onClick={() => handlePageChange(page - 1)} className="font-label-sm text-[10px] uppercase tracking-widest disabled:opacity-30">Prev</button>
              <span className="font-newsreader italic text-sm">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)} className="font-label-sm text-[10px] uppercase tracking-widest disabled:opacity-30">Next</button>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#FAF3E0] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <header className="flex justify-between items-center p-8 border-b border-outline-variant shrink-0">
              <h3 className="font-headline-h3 text-2xl italic">{selectedBook ? "Edit Book" : "Add New Book"}</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-8">
              <form id="book-form" onSubmit={handleSaveBook} className="flex flex-col gap-8">
                <div className="flex flex-col">
                  <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Book Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-newsreader text-2xl text-on-surface focus:ring-0 focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Author</label>
                    <input required type="text" value={formData.authorName} onChange={e => setFormData({...formData, authorName: e.target.value})} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary font-inter" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Publisher</label>
                    <input required type="text" value={formData.publisherName} onChange={e => setFormData({...formData, publisherName: e.target.value})} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary font-inter" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Category</label>
                    <input required type="text" value={formData.categoryName} onChange={e => setFormData({...formData, categoryName: e.target.value})} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary font-inter" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Price (Rp)</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary font-inter" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Availability</label>
                    <select value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary font-inter">
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                      <option value="Pre-order">Pre-order</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary font-inter">
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Cover Image Upload</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm font-inter file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-on-surface cursor-pointer" />
                  {formData.imageUrl && <img src={formData.imageUrl} className="mt-4 h-32 object-contain self-start border border-outline-variant p-1" alt="Preview" />}
                </div>
                <div className="flex flex-col">
                  <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Synopsis</label>
                  <textarea rows={4} value={formData.synopsis} onChange={e => setFormData({...formData, synopsis: e.target.value})} className="w-full bg-transparent border border-outline-variant p-4 font-inter text-sm focus:ring-0 focus:border-primary"></textarea>
                </div>
              </form>
            </div>
            <footer className="p-8 border-t border-outline-variant bg-[#FAF3E0] flex justify-end gap-4 shrink-0">
              <button onClick={() => setIsDrawerOpen(false)} className="border border-outline text-outline font-newsreader uppercase tracking-widest text-xs px-6 py-3 hover:bg-white transition-colors">Cancel</button>
              <button form="book-form" type="submit" disabled={loading} className="bg-primary text-white font-newsreader uppercase tracking-widest text-xs px-8 py-3 hover:bg-on-surface transition-colors shadow-lg disabled:opacity-50">Save Book</button>
            </footer>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white border border-outline-variant p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline-h3 text-2xl italic text-primary mb-4">Delete Book?</h3>
            <p className="font-inter text-on-surface-variant mb-8">Are you sure you want to delete <strong className="text-on-surface">{selectedBook?.title}</strong>? This action cannot be undone.</p>
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
