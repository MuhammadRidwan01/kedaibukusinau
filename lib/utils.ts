/**
 * Convert a string to a URL-friendly slug.
 * "Haruki Murakami" → "haruki-murakami"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Format price in Indonesian Rupiah.
 * 125000 → "Rp 125.000"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Highlight matching text by wrapping in <mark> tags.
 * Used for pg_trgm fuzzy search results where ts_headline isn't available.
 */
export function highlightText(text: string | null, query: string): string {
  if (!text || !query) return text || "";
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
