import Link from "next/link";
import React from "react";

interface BookCardProps {
  slug: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  badge?: "Best Seller" | "New" | "Sale";
  staggered?: boolean;
}

export function BookCard({
  slug,
  title,
  author,
  price,
  originalPrice,
  imageUrl,
  badge,
  staggered,
}: BookCardProps) {
  return (
    <Link
      href={`/catalog/${slug}`}
      className={`flex flex-col gap-6 group cursor-pointer ${
        staggered ? "lg:mt-8" : ""
      }`}
    >
      <div className="relative p-4 bg-white border border-outline-variant/30 shadow-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-md">
        {badge === "Best Seller" && (
          <span className="book-badge book-badge--bestseller">Best Seller</span>
        )}
        {badge === "New" && (
          <span className="book-badge book-badge--new">New</span>
        )}
        {badge === "Sale" && (
          <span className="book-badge book-badge--diskon">Sale</span>
        )}
        <img
          alt={title}
          className="book-cover w-full object-cover"
          src={imageUrl}
        />
      </div>
      <div className="flex flex-col gap-1.5 text-center mt-2">
        <span className="font-headline-h3 text-base sm:text-lg text-on-surface line-clamp-2 leading-snug">
          {title}
        </span>
        <span className="font-newsreader italic text-sm sm:text-base text-on-surface-variant">
          {author}
        </span>
        {originalPrice ? (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5">
            <span className="font-label-sm text-xs sm:text-sm text-on-surface-variant line-through opacity-50 whitespace-nowrap">
              Rp {originalPrice.toLocaleString("id-ID")}
            </span>
            <span className="font-label-sm text-sm sm:text-base text-primary font-bold whitespace-nowrap">
              Rp {price.toLocaleString("id-ID")}
            </span>
          </div>
        ) : (
          <span className="font-label-sm text-sm sm:text-base text-primary font-bold mt-1.5 whitespace-nowrap">
            Rp {price.toLocaleString("id-ID")}
          </span>
        )}
      </div>
    </Link>
  );
}
