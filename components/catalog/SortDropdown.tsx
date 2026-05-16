"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { buildFilterUrl } from "@/lib/url-builder";

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const url = buildFilterUrl(currentParams, { sort: e.target.value });
    router.push(url);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="font-label-sm uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">
        Sorted By
      </span>
      <select
        value={currentSort}
        onChange={handleChange}
        className="bg-transparent border-b border-outline py-1 pr-6 font-newsreader italic text-lg text-on-surface focus:outline-none appearance-none cursor-pointer"
      >
        <option value="newest">Newest Additions</option>
        <option value="bestseller">Bestsellers</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
