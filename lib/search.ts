import { Prisma } from "@/app/generated/prisma/client";
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

interface RankedBookResult extends BookResult {
  matchTier: number;
}

/**
 * Combined search ranking:
 *   Tier 1: tsvector FTS with prefix matching
 *   Tier 2: ILIKE substring match
 *   Tier 3: pg_trgm fuzzy match
 *
 * All tiers are queried together so the rendered books and total count always
 * describe the same result set.
 */
export async function searchBooks(
  query: string,
  page: number = 1,
  limit: number = 12,
  options: SearchOptions = {}
): Promise<SearchResult> {
  const offset = (page - 1) * limit;
  const filterConditions = buildFilterConditions(options);
  const prefixTsQuery = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, ""))
    .filter(Boolean)
    .map((word) => `${word}:*`)
    .join(" & ");
  const ilike = `%${query}%`;
  const startsWith = `${query}%`;

  const rawBooks = await prisma.$queryRaw<RankedBookResult[]>(Prisma.sql`
    WITH candidates AS (
      SELECT
        b."id",
        b."slug",
        b."title",
        b."price",
        b."originalPrice",
        b."imageUrl",
        b."badge",
        b."synopsis",
        b."isbn",
        b."searchVector",
        a."name" AS "authorName",
        COALESCE(
          b."searchVector" @@ to_tsquery('english', NULLIF(${prefixTsQuery}, '')),
          false
        ) AS "fulltextMatch",
        (
          b."title" ILIKE ${ilike}
          OR COALESCE(a."name", '') ILIKE ${ilike}
          OR COALESCE(b."isbn", '') ILIKE ${ilike}
        ) AS "substringMatch",
        GREATEST(
          similarity(b."title", ${query}),
          similarity(COALESCE(a."name", ''), ${query}),
          similarity(COALESCE(b."isbn", ''), ${query})
        ) AS "fuzzyRank"
      FROM "Book" b
      LEFT JOIN "Author" a ON b."authorId" = a."id"
      WHERE b."status" = 'Active'
      ${filterConditions}
    ),
    ranked AS (
      SELECT
        "id",
        "slug",
        "title",
        "price",
        "originalPrice",
        "imageUrl",
        "badge",
        "synopsis",
        "authorName",
        CASE
          WHEN "fulltextMatch" THEN 1
          WHEN "substringMatch" THEN 2
          ELSE 3
        END AS "matchTier",
        CASE
          WHEN "fulltextMatch" THEN
            ts_rank("searchVector", to_tsquery('english', NULLIF(${prefixTsQuery}, '')))
          WHEN "title" ILIKE ${startsWith} THEN 3
          WHEN COALESCE("authorName", '') ILIKE ${startsWith} THEN 2
          WHEN COALESCE("isbn", '') ILIKE ${startsWith} THEN 1
          WHEN "substringMatch" THEN 0.5
          ELSE "fuzzyRank"
        END AS rank,
        CASE
          WHEN "fulltextMatch" THEN ts_headline(
            'english',
            "title",
            to_tsquery('english', NULLIF(${prefixTsQuery}, '')),
            'StartSel=<mark>, StopSel=</mark>, MaxFragments=0'
          )
          ELSE "title"
        END AS "highlightedTitle",
        CASE
          WHEN "fulltextMatch" THEN ts_headline(
            'english',
            COALESCE("authorName", ''),
            to_tsquery('english', NULLIF(${prefixTsQuery}, '')),
            'StartSel=<mark>, StopSel=</mark>, MaxFragments=0'
          )
          ELSE COALESCE("authorName", '')
        END AS "highlightedAuthor",
        CASE
          WHEN "fulltextMatch" THEN ts_headline(
            'english',
            COALESCE("synopsis", ''),
            to_tsquery('english', NULLIF(${prefixTsQuery}, '')),
            'StartSel=<mark>, StopSel=</mark>, MaxFragments=1, MaxWords=30'
          )
          ELSE COALESCE("synopsis", '')
        END AS "highlightedSynopsis",
        "fuzzyRank"
      FROM candidates
      WHERE "fulltextMatch" OR "substringMatch" OR "fuzzyRank" > 0.15
    )
    SELECT
      "id",
      "slug",
      "title",
      "price",
      "originalPrice",
      "imageUrl",
      "badge",
      "synopsis",
      "authorName",
      rank,
      "matchTier",
      "highlightedTitle",
      "highlightedAuthor",
      "highlightedSynopsis"
    FROM ranked
    ORDER BY "matchTier" ASC, rank DESC, "fuzzyRank" DESC, "title" ASC
    LIMIT ${limit} OFFSET ${offset}
  `);

  const countResult = await prisma.$queryRaw<
    { count: number; bestMatchTier: number | null }[]
  >(Prisma.sql`
    SELECT
      COUNT(*)::int AS count,
      MIN(
        CASE
          WHEN COALESCE(
            b."searchVector" @@ to_tsquery('english', NULLIF(${prefixTsQuery}, '')),
            false
          ) THEN 1
          WHEN (
            b."title" ILIKE ${ilike}
            OR COALESCE(a."name", '') ILIKE ${ilike}
            OR COALESCE(b."isbn", '') ILIKE ${ilike}
          ) THEN 2
          ELSE 3
        END
      )::int AS "bestMatchTier"
    FROM "Book" b
    LEFT JOIN "Author" a ON b."authorId" = a."id"
    WHERE b."status" = 'Active'
      AND (
        COALESCE(
          b."searchVector" @@ to_tsquery('english', NULLIF(${prefixTsQuery}, '')),
          false
        )
        OR b."title" ILIKE ${ilike}
        OR COALESCE(a."name", '') ILIKE ${ilike}
        OR COALESCE(b."isbn", '') ILIKE ${ilike}
        OR similarity(b."title", ${query}) > 0.15
        OR similarity(COALESCE(a."name", ''), ${query}) > 0.15
        OR similarity(COALESCE(b."isbn", ''), ${query}) > 0.15
      )
      ${filterConditions}
  `);

  const books = rawBooks.map(({ matchTier, ...book }) =>
    matchTier === 1
      ? book
      : {
          ...book,
          highlightedTitle: highlightText(book.title, query),
          highlightedAuthor: highlightText(book.authorName, query),
          highlightedSynopsis: highlightText(book.synopsis, query),
        }
  );
  const bestMatchTier = countResult[0]?.bestMatchTier;

  return {
    books,
    total: countResult[0]?.count ?? 0,
    searchMethod:
      bestMatchTier === 1
        ? "fulltext"
        : bestMatchTier === 2
          ? "prefix"
          : bestMatchTier === 3
            ? "fuzzy"
            : "none",
  };
}

/**
 * Get top suggestion for Tab-to-complete ghost text.
 * Uses prefix ILIKE with trigram index.
 */
export async function getSuggestion(query: string): Promise<string | null> {
  if (query.length < 2) return null;

  const results = await prisma.$queryRaw<{ title: string }[]>(Prisma.sql`
    SELECT "title"
    FROM "Book"
    WHERE "status" = 'Active'
      AND "title" ILIKE ${`${query}%`}
    ORDER BY similarity("title", ${query}) DESC
    LIMIT 1
  `);

  return results[0]?.title ?? null;
}

function buildFilterConditions(options: SearchOptions): Prisma.Sql {
  const conditions: Prisma.Sql[] = [];

  if (options.category) {
    conditions.push(Prisma.sql`
      b."categoryId" = (SELECT id FROM "Category" WHERE slug = ${options.category})
    `);
  }
  if (options.minPrice !== undefined) {
    conditions.push(Prisma.sql`b."price" >= ${options.minPrice}`);
  }
  if (options.maxPrice !== undefined) {
    conditions.push(Prisma.sql`b."price" <= ${options.maxPrice}`);
  }
  if (options.badge) {
    conditions.push(Prisma.sql`b."badge" = ${options.badge}`);
  }
  if (options.authorSlug) {
    conditions.push(Prisma.sql`a."slug" = ${options.authorSlug}`);
  }

  return conditions.length > 0
    ? Prisma.sql`AND ${Prisma.join(conditions, " AND ")}`
    : Prisma.empty;
}
