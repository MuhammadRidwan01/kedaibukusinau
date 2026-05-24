"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getArticles, deleteArticle } from "@/app/admin/actions/articles";

export function ArticlesClient({ initialArticles, initialTotal, initialPage, initialTotalPages }: any) {
  const [articles, setArticles] = useState(initialArticles);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [loading, setLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const fetchArticles = useCallback(async (p: number, q: string, status: string) => {
    setLoading(true);
    const res = await getArticles({ page: p, q, status });
    if (res.success) {
      setArticles(res.articles);
      setTotal(res.total);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } else {
      toast.error(res.error || "Failed to load articles");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles(1, search, filterStatus);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, filterStatus, fetchArticles]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchArticles(newPage, search, filterStatus);
  };

  const handleDeleteClick = (article: any) => {
    setSelectedArticle(article);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedArticle) return;
    setLoading(true);
    const res = await deleteArticle(selectedArticle.id);
    if (res.success) {
      toast.success("Article deleted successfully");
      setIsDeleteModalOpen(false);
      fetchArticles(page, search, filterStatus);
    } else {
      toast.error(res.error || "Failed to delete article");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center pb-8 border-b border-outline-variant/80 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">Editorial Journal</span>
          <h2 className="font-headline-h2 text-3xl lg:text-4xl text-on-surface italic tracking-tight">Manage Articles</h2>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <Link href="/admin/articles/editor" className="flex items-center gap-2 bg-on-surface text-white font-newsreader uppercase tracking-widest text-xs px-6 py-3 hover:bg-primary transition-all duration-300">
            <span className="material-symbols-outlined text-[18px]">edit_document</span> Write Article
          </Link>
        </div>
      </header>

      <div className="flex-1 py-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="flex items-end gap-2 border-b border-outline-variant pb-1 w-full md:w-96">
            <span className="material-symbols-outlined font-light text-on-surface-variant text-[20px] mb-0.5">search</span>
            <input type="text" placeholder="Search by article title..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none focus:ring-0 p-0 w-full font-newsreader italic text-lg placeholder-on-surface-variant/50 text-on-surface focus:outline-none" />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant shrink-0">Status:</span>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-transparent border-b border-outline-variant py-1 pr-8 font-newsreader text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer">
              <option value="All Status">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="w-full relative">
          {loading && <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">Loading...</div>}
          <div className="grid grid-cols-[3rem_6rem_2.5fr_1fr_1fr_1fr_auto] gap-4 items-end px-4 py-3 border-b-2 border-outline-variant/80 text-on-surface-variant">
            <span className="font-label-sm text-[9px] uppercase tracking-widest">No</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest text-center">Thumb</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">Title</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">Category</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">Date</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest">Status</span>
            <span className="font-label-sm text-[9px] uppercase tracking-widest text-right pr-2">Actions</span>
          </div>

          <div className="flex flex-col">
            {articles.length === 0 ? (
              <div className="py-8 text-center text-on-surface-variant font-newsreader italic">No articles found.</div>
            ) : (
              articles.map((article: any, index: number) => (
                <div key={article.id} className="grid grid-cols-[3rem_6rem_2.5fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-4 border-b border-outline-variant/40 hover:bg-white transition-colors group">
                  <span className="font-newsreader text-sm opacity-50">{String((page - 1) * 20 + index + 1).padStart(2, "0")}</span>
                  <img alt="Thumbnail" className="w-16 aspect-video object-cover editorial-inner shadow-sm grayscale bg-surface-variant" src={article.imageUrl || 'https://via.placeholder.com/160x90'} />
                  <span className="font-headline-h3 text-lg group-hover:text-primary transition-colors truncate">{article.title}</span>
                  <span className="font-newsreader italic text-on-surface-variant truncate">{article.category?.name || "Uncategorized"}</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant/70">
                    {new Date(article.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <div>
                    <span className={`px-2 py-1 font-label-sm text-[9px] uppercase tracking-widest ${article.status === "Published" ? "bg-[#25D366]/10 text-[#25D366]" : "border border-outline-variant text-outline-variant"}`}>
                      {article.status}
                    </span>
                  </div>
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/admin/articles/editor?id=${article.id}`} className="text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </Link>
                    <button onClick={() => handleDeleteClick(article)} className="text-on-surface-variant hover:text-primary transition-colors" title="Delete">
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

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white border border-outline-variant p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline-h3 text-2xl italic text-primary mb-4">Delete Article?</h3>
            <p className="font-inter text-on-surface-variant mb-8">Are you sure you want to delete <strong className="text-on-surface">{selectedArticle?.title}</strong>? This action cannot be undone.</p>
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
