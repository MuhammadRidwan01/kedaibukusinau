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
      <div className="flex flex-col gap-2 text-center">
        <span className="font-headline-h3 text-headline-h3 text-on-surface">
          {title}
        </span>
        <span className="font-newsreader italic text-on-surface-variant">
          {author}
        </span>
        {originalPrice ? (
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="font-label-sm text-sm text-on-surface-variant line-through opacity-60">
              Rp {originalPrice.toLocaleString("id-ID")}
            </span>
            <span className="font-label-sm text-sm text-primary">
              Rp {price.toLocaleString("id-ID")}
            </span>
          </div>
        ) : (
          <span className="font-label-sm text-sm text-primary mt-2">
            Rp {price.toLocaleString("id-ID")}
          </span>
        )}
      </div>
    </Link>
  );
}
