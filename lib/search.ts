import { prisma } from "@/lib/prisma";
import { highlightText } from "@/lib/utils";

export interface SearchOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  badge?: string;
  authorSlug?: string;
}

export interface BookResult {
  id: number;
  slug: string;
  title: string;
  highlightedTitle: string;
  authorName: string | null;
  highlightedAuthor: string;
  imageUrl: string | null;
  synopsis: string | null;
  highlightedSynopsis: string;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  rank: number;
}

export interface SearchResult {
  books: BookResult[];
  total: number;
  searchMethod: "fulltext" | "fuzzy" | "prefix" | "none";
}

/**
 * Triple-layer search:
 *   Layer 1: tsvector FTS with prefix matching (to_tsquery with :*)
 *   Layer 2: ILIKE prefix match (catches partial words like "nor" → "Normal")
 *   Layer 3: pg_trgm fuzzy (typo tolerance: "murakmi" → "Murakami")
 */
export async function searchBooks(
  query: string,
  page: number = 1,
  limit: number = 12,
  options: SearchOptions = {}
): Promise<SearchResult> {
  const offset = (page - 1) * limit;
  const filterConditions = buildFilterConditions(options);

  // Sanitize query for to_tsquery prefix: split words, add :* to each
  const prefixTsQuery = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, ""))
    .filter(Boolean)
    .map((w) => `${w}:*`)
    .join(" & ");

  // Layer 1: tsvector FTS with prefix matching
  let books: BookResult[] = [];
  let searchMethod: "fulltext" | "fuzzy" | "prefix" | "none" = "none";

  if (prefixTsQuery) {
    books = await prisma.$queryRawUnsafe(
      `SELECT b."id", b."slug", b."title", b."price", b."originalPrice",
              b."imageUrl", b."badge", b."synopsis",
              a."name" AS "authorName",
              ts_rank(b."searchVector", to_tsquery('english', $1)) AS rank,
              ts_headline('english', b."title",
                to_tsquery('english', $1),
                'StartSel=<mark>, StopSel=</mark>, MaxFragments=0'
              ) AS "highlightedTitle",
              ts_headline('english', COALESCE(a."name", ''),
                to_tsquery('english', $1),
                'StartSel=<mark>, StopSel=</mark>, MaxFragments=0'
              ) AS "highlightedAuthor",
              ts_headline('english', COALESCE(b."synopsis", ''),
                to_tsquery('english', $1),
                'StartSel=<mark>, StopSel=</mark>, MaxFragments=1, MaxWords=30'
              ) AS "highlightedSynopsis"
       FROM "Book" b
       LEFT JOIN "Author" a ON b."authorId" = a."id"
       WHERE b."status" = 'Active'
         AND b."searchVector" @@ to_tsquery('english', $1)
         ${filterConditions}
       ORDER BY rank DESC
       LIMIT $2 OFFSET $3`,
      prefixTsQuery,
      limit,
      offset
    );

    if (books.length > 0) searchMethod = "fulltext";
  }

  // Layer 2: ILIKE prefix match on title + author (catches partial words)
  if (books.length === 0) {
    const ilike = `%${query}%`;
    books = await prisma.$queryRawUnsafe(
      `SELECT b."id", b."slug", b."title", b."price", b."originalPrice",
              b."imageUrl", b."badge", b."synopsis",
              a."name" AS "authorName",
              CASE
                WHEN b."title" ILIKE $4 THEN 3
                WHEN a."name" ILIKE $4 THEN 2
                ELSE 1
              END AS rank
       FROM "Book" b
       LEFT JOIN "Author" a ON b."authorId" = a."id"
       WHERE b."status" = 'Active'
         AND (
           b."title" ILIKE $1
           OR a."name" ILIKE $1
           OR b."isbn" ILIKE $1
         )
         ${filterConditions}
       ORDER BY rank DESC, b."title" ASC
       LIMIT $2 OFFSET $3`,
      ilike,
      limit,
      offset,
      query + "%"
    );

    // Highlight via server-side regex
    books = books.map((r) => ({
      ...r,
      highlightedTitle: highlightText(r.title, query),
      highlightedAuthor: highlightText(r.authorName, query),
      highlightedSynopsis: highlightText(r.synopsis, query),
    }));

    if (books.length > 0) searchMethod = "prefix";
  }

  // Layer 3: pg_trgm fuzzy fallback (typo tolerance)
  if (books.length === 0) {
    books = await prisma.$queryRawUnsafe(
      `SELECT b."id", b."slug", b."title", b."price", b."originalPrice",
              b."imageUrl", b."badge", b."synopsis",
              a."name" AS "authorName",
              GREATEST(
                similarity(b."title", $1),
                similarity(COALESCE(a."name", ''), $1),
                similarity(COALESCE(b."isbn", ''), $1)
              ) AS rank
       FROM "Book" b
       LEFT JOIN "Author" a ON b."authorId" = a."id"
       WHERE b."status" = 'Active'
         AND (
           similarity(b."title", $1) > 0.15
           OR similarity(a."name", $1) > 0.15
           OR similarity(COALESCE(b."isbn", ''), $1) > 0.15
         )
         ${filterConditions}
       ORDER BY rank DESC
       LIMIT $2 OFFSET $3`,
      query,
      limit,
      offset
    );

    // Highlight via server-side regex for pg_trgm results
    books = books.map((r) => ({
      ...r,
      highlightedTitle: highlightText(r.title, query),
      highlightedAuthor: highlightText(r.authorName, query),
      highlightedSynopsis: highlightText(r.synopsis, query),
    }));

    searchMethod = books.length > 0 ? "fuzzy" : "none";
  }

  // Total count
  const ilike = `%${query}%`;
  const countResult: { count: number }[] = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS count FROM "Book" b
     LEFT JOIN "Author" a ON b."authorId" = a."id"
     WHERE b."status" = 'Active' AND (
       ${prefixTsQuery ? `b."searchVector" @@ to_tsquery('english', $2) OR` : ""}
       b."title" ILIKE $1
       OR a."name" ILIKE $1
       OR similarity(b."title", $3) > 0.15
       OR similarity(COALESCE(a."name", ''), $3) > 0.15
     ) ${filterConditions}`,
    ilike,
    prefixTsQuery || "",
    query
  );

  return {
    books,
    total: countResult[0]?.count ?? 0,
    searchMethod,
  };
}

/**
 * Get top suggestion for Tab-to-complete ghost text.
 * Uses prefix ILIKE with trigram index — ~0.5ms.
 */
export async function getSuggestion(
  query: string
): Promise<string | null> {
  if (query.length < 2) return null;

  const results: { title: string }[] = await prisma.$queryRawUnsafe(
    `SELECT "title" FROM "Book"
     WHERE "status" = 'Active'
       AND "title" ILIKE $1
     ORDER BY similarity("title", $2) DESC
     LIMIT 1`,
    query + "%",
    query
  );

  return results[0]?.title ?? null;
}

function buildFilterConditions(options: SearchOptions): string {
  const conditions: string[] = [];

  if (options.category) {
    conditions.push(
      `AND b."categoryId" = (SELECT id FROM "Category" WHERE slug = '${options.category}')`
    );
  }
  if (options.minPrice !== undefined) {
    conditions.push(`AND b."price" >= ${Number(options.minPrice)}`);
  }
  if (options.maxPrice !== undefined) {
    conditions.push(`AND b."price" <= ${Number(options.maxPrice)}`);
  }
  if (options.badge) {
    conditions.push(`AND b."badge" = '${options.badge}'`);
  }

  return conditions.join(" ");
}
