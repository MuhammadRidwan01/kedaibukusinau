"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { buildFilterUrl } from "@/lib/url-builder";

interface PriceFilterProps {
  currentMin?: number;
  currentMax?: number;
}

export function PriceFilter({ currentMin, currentMax }: PriceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [min, setMin] = useState(currentMin?.toString() || "");
  const [max, setMax] = useState(currentMax?.toString() || "");

  const currentParams = Object.fromEntries(searchParams.entries());

  const handleApply = () => {
    const url = buildFilterUrl(currentParams, {
      minPrice: min || null,
      maxPrice: max || null,
    });
    router.push(url);
  };

  return (
    <div>
      <h3 className="font-label-sm uppercase tracking-[0.2em] text-on-surface mb-6 text-[11px]">
        Price Range (IDR)
      </h3>
      <div className="flex items-center gap-4 border-b border-outline pb-2">
        <div className="flex-1">
          <input
            type="number"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-full bg-transparent text-center font-newsreader italic text-lg text-on-surface focus:outline-none transition-colors"
          />
        </div>
        <span className="text-outline">~</span>
        <div className="flex-1">
          <input
            type="number"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-full bg-transparent text-center font-newsreader italic text-lg text-on-surface focus:outline-none transition-colors"
          />
        </div>
      </div>
      <button
        onClick={handleApply}
        className="w-full mt-6 bg-transparent border border-outline text-outline py-3 font-label-sm uppercase tracking-[0.2em] text-[10px] hover:bg-outline hover:text-white transition-colors"
      >
        Apply Parameters
      </button>
    </div>
  );
}
