-- ═══════════════════════════════════════════════════════
-- SEARCH OPTIMIZATION: pg_trgm + tsvector dual-layer
-- ═══════════════════════════════════════════════════════

-- 1. Enable pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Trigram GIN indexes for fuzzy search (typo tolerance)
--    These accelerate: ILIKE '%query%', similarity(), and % operator
CREATE INDEX "Book_title_trgm_idx"
  ON "Book" USING GIN ("title" gin_trgm_ops);

CREATE INDEX "Author_name_trgm_idx"
  ON "Author" USING GIN ("name" gin_trgm_ops);

CREATE INDEX "Book_isbn_trgm_idx"
  ON "Book" USING GIN ("isbn" gin_trgm_ops);

-- 3. Trigger function to auto-populate searchVector on Book
--    Combines: title (weight A) + author name (weight B) + synopsis (weight C)
CREATE OR REPLACE FUNCTION update_book_search_vector()
RETURNS TRIGGER AS $$
DECLARE
  author_name TEXT;
BEGIN
  -- Fetch the related author name
  SELECT "name" INTO author_name
  FROM "Author"
  WHERE "id" = NEW."authorId";

  -- Build weighted tsvector
  NEW."searchVector" :=
    setweight(to_tsvector('english', COALESCE(NEW."title", '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(author_name, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW."synopsis", '')), 'C');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Attach trigger to Book table
CREATE TRIGGER book_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "Book"
  FOR EACH ROW
  EXECUTE FUNCTION update_book_search_vector();

-- 5. Also update searchVector when Author name changes
CREATE OR REPLACE FUNCTION update_books_on_author_change()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Book" SET "updatedAt" = NOW()
  WHERE "authorId" = NEW."id";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER author_name_change_trigger
  AFTER UPDATE OF "name" ON "Author"
  FOR EACH ROW
  EXECUTE FUNCTION update_books_on_author_change();

-- 6. Additional performance indexes
CREATE INDEX "Book_status_idx" ON "Book" ("status");
CREATE INDEX "Book_badge_idx" ON "Book" ("badge");
CREATE INDEX "Book_availability_idx" ON "Book" ("availability");
CREATE INDEX "Book_categoryId_idx" ON "Book" ("categoryId");
CREATE INDEX "Book_authorId_idx" ON "Book" ("authorId");
CREATE INDEX "Book_createdAt_idx" ON "Book" ("createdAt" DESC);
CREATE INDEX "Book_isFeaturedBestseller_idx" ON "Book" ("isFeaturedBestseller") WHERE "isFeaturedBestseller" = true;

CREATE INDEX "Article_status_idx" ON "Article" ("status");
CREATE INDEX "Article_isFeatured_idx" ON "Article" ("isFeatured") WHERE "isFeatured" = true;
CREATE INDEX "Article_publishedAt_idx" ON "Article" ("publishedAt" DESC);
CREATE INDEX "Article_categoryId_idx" ON "Article" ("categoryId");

-- 7. Trigram index on Article title for journal search
CREATE INDEX "Article_title_trgm_idx"
  ON "Article" USING GIN ("title" gin_trgm_ops);