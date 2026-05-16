import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client.js";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── ADMINS ────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.admin.createMany({
    data: [
      { name: "Super Admin", email: "admin@kedaisinau.com", password: adminPassword },
      { name: "Editor", email: "editor@kedaisinau.com", password: adminPassword },
      { name: "Manager", email: "manager@kedaisinau.com", password: adminPassword },
    ],
    skipDuplicates: true,
  });
  console.log("✓ Admins seeded");

  // ─── AUTHORS ───────────────────────────────────────
  const authorData = [
    "Elena Rossi", "Marcus Thorne", "Sarah Jenkins", "David Chen",
    "Clara Woods", "Antoine Miller", "Jonathan Pierce", "Matt Haig",
    "Kazuo Ishiguro", "Sally Rooney", "Donna Tartt", "Hanya Yanagihara",
    "Haruki Murakami", "Virginia Woolf", "Pramoedya Ananta Toer", "Eka Kurniawan",
  ];
  for (const name of authorData) {
    await prisma.author.upsert({
      where: { name },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") },
    });
  }
  const authors: Record<string, number> = {};
  for (const a of await prisma.author.findMany()) authors[a.name] = a.id;
  console.log("✓ Authors seeded");

  // ─── PUBLISHERS ────────────────────────────────────
  const publisherData = ["Penguin Books", "Vintage International", "HarperCollins", "Gramedia Pustaka", "Kepustakaan Populer Gramedia"];
  for (const name of publisherData) {
    await prisma.publisher.upsert({ where: { name }, update: {}, create: { name } });
  }
  const publishers: Record<string, number> = {};
  for (const p of await prisma.publisher.findMany()) publishers[p.name] = p.id;
  console.log("✓ Publishers seeded");

  // ─── CATEGORIES ────────────────────────────────────
  const categoryData = [
    { name: "Contemporary Fiction", slug: "contemporary-fiction" },
    { name: "Classic Literature", slug: "classic-literature" },
    { name: "Non-Fiction & Essays", slug: "non-fiction-essays" },
    { name: "Poetry & Prose", slug: "poetry-prose" },
    { name: "Art & Design Theory", slug: "art-design-theory" },
  ];
  for (const c of categoryData) {
    await prisma.category.upsert({ where: { name: c.name }, update: {}, create: c });
  }
  const categories: Record<string, number> = {};
  for (const c of await prisma.category.findMany()) categories[c.name] = c.id;
  console.log("✓ Categories seeded");

  // ─── GENRES ────────────────────────────────────────
  const genreData = [
    "Romance", "Self-Help", "Psychology", "Business", "Design",
    "Fiction", "History", "Philosophy", "Science", "Poetry",
  ];
  for (const name of genreData) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
    });
  }
  console.log("✓ Genres seeded");

  // ─── ARTICLE CATEGORIES ────────────────────────────
  const artCatData = [
    { name: "Featured", slug: "featured" },
    { name: "Interview", slug: "interview" },
    { name: "Book Review", slug: "book-review" },
    { name: "Editorial Essay", slug: "editorial-essay" },
    { name: "News", slug: "news" },
  ];
  for (const c of artCatData) {
    await prisma.articleCategory.upsert({ where: { name: c.name }, update: {}, create: c });
  }
  const artCategories: Record<string, number> = {};
  for (const c of await prisma.articleCategory.findMany()) artCategories[c.name] = c.id;
  console.log("✓ Article Categories seeded");

  // ─── BOOKS ─────────────────────────────────────────
  const defaultImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuBR8oxFq1ypyMPZfkhOAqcefhfYMPRBSDcQBTmEk5W-CcgyZ4sfQpY8p-o0V1ruyFsuFjwVzEqUZDD0rfgFusWZdKWzGltaBBdBbOV2NhNioPZYXmqfQycCr-m8-YjEWCSuZpOnrC7Eflv75kgumKgA9JylMi9SdQebj6dHiVLSZYM5_hoxqovPo92CB-F_udlQrSPkhV_7Vd8GXw0qOGbgJ8Qe1aLfzOBb3AxY3nciu6vwgRc_WhZ_U9y8gYX3tiv0OqyuBrk1NjzQ";
  const img2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuAltnwkDOLQ_vcedkVGnGXmE62gQZ9H24jRhKZxE5OqC8mpBsB-q2uWpxzbhBLbmrlCHTbY9G9A3yvPmECBqXEhpK1ECC1uAD32-WW6KOZYVfA7BSaNqMCv_oCZDXSJ26W3ZtLlrLIFGjYh4YGRlsn_zWgLrIlmYxDoICXgc7EWDeiIGGZUpYBDC45Ankb4KyxEkZUN7HRW6oCyg-b3DKqdjiV7R1DSwkTKQBAwNbHoWuPZ8_SCulwJht13yDgQZdi5v09ql5GNIWqO";
  const img3 = "https://lh3.googleusercontent.com/aida-public/AB6AXuBpQv7ds9jqq7B8Fmp6MqcSC7VbSpsfIGtfyw2zbjfQhH_6YTYR_VS3Y6CL_avks9skK_IrFNswjVS0jcbXG1BXob66UW1DZhnD78gr-G4VTsbPxkAkewSvdeXfYzH9y1qZNMQF0cDxdgT9FrGzt6YdTKxxAJc0OT5AMEGgoP1qiFw4F11o0nAkgLH433jx977XZfRqwrnx0Ao-yRfHimvmgl-RrdkZ1dn6vej5fA5p8Cstyp2TriA8u7Mw3h8zIqJNlzfHJ79S0T91";
  const img4 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCN135f6k9HHk3K_SbJF2SEkOFq7Ln2lCUYPjOOotE1HHra5JXQA2plhokI0adL-M4EaXRkvLAbnCj9st8MX0hS7CTxLA9KbmaankbcrlcrTe3PoWyM6rMDjlaYgKsiXC3dlI7yp34rj7basd497qwnLjk4a1Xrfa7koaGkvGUVyE1ujQy54_35AHhwpLyfV1hDaNffp1YAjYN9PDEmrAXUxDJEsMcTetVqMec9Vt1tm0KtXZP2in1Yq9cBd1pRXx7DZUtOLEsEweCq";
  const img5 = "https://lh3.googleusercontent.com/aida-public/AB6AXuDUSnJQXi3d6_3bNq-LBgUSrEGktWiDneEG50B-geqUigNw1MBagVxjCKJITMmlKO_ANnfno6Qw3jBSu5XASU2PQGKqewyD1rLHVZdE-uqho8sMhq1ZEUgof7u5jBPl_LX3mcp77dl-RiRZGQMA8OnmtyDR8CkPfzb1Fg0-XnU8GS-Tv66aSvcbTOEdRKV7MJPYRIYiYbFZKKzpOi2U9FlorkJafoiEds3O0NYlLuibzSrUqouwPqrBdJ9EJTJBFCW3c5prL2qs5IZP";
  const img6 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCXdtxVvjzntwnPWBLeaFKKgQq6m_ZFSqU3PM-W-mqlXoDshh1kan0FRZoXJMCIOZiK5NEXQLNwKAqiEpaFVvmbSJzmo-0RQpivV5pu9vQTdWU27XIYZa3MDkYKklXPQHpIk5iqmCvsF95h9dCLIJ-iR4HCVQDOUgMNmhTQHtKeqWNZKUuwszivfU6O9_v1rEzhNJgYK9K-mw42NeiayxeGSyAS1XfURwCIFg8DzLLCCTl5E7hYUbFLLO_iUeKqEZ1PxFmwiHtutZ2N";

  const booksData = [
    { slug: "whispers-in-the-wind", title: "Whispers in the Wind", authorName: "Elena Rossi", price: 125000, imageUrl: img6, badge: "Best Seller", categoryName: "Contemporary Fiction", synopsis: "A lyrical journey through the Italian countryside." },
    { slug: "the-art-of-stillness", title: "The Art of Stillness", authorName: "Marcus Thorne", price: 140000, imageUrl: defaultImg, badge: "New", categoryName: "Non-Fiction & Essays", synopsis: "Exploring mindfulness and presence in a chaotic world." },
    { slug: "echoes-of-the-past", title: "Echoes of the Past", authorName: "Sarah Jenkins", price: 110000, imageUrl: img2, categoryName: "Contemporary Fiction", synopsis: "Memories that haunt and histories that shape us." },
    { slug: "urban-landscapes", title: "Urban Landscapes", authorName: "David Chen", price: 155000, originalPrice: 195000, imageUrl: img3, badge: "Sale", categoryName: "Art & Design Theory", synopsis: "A visual meditation on the beauty of modern cities." },
    { slug: "the-silent-observer", title: "The Silent Observer", authorName: "Clara Woods", price: 130000, imageUrl: img4, categoryName: "Contemporary Fiction", synopsis: "A story about the power of watching and understanding." },
    { slug: "design-philosophy", title: "Design Philosophy", authorName: "Antoine Miller", price: 195000, imageUrl: img5, badge: "Best Seller", categoryName: "Art & Design Theory", synopsis: "The intersection of form and function in modern design." },
    { slug: "beyond-the-horizon", title: "Beyond The Horizon", authorName: "Jonathan Pierce", price: 145000, imageUrl: img2, badge: "New", categoryName: "Contemporary Fiction", synopsis: "An adventure that pushes the boundaries of imagination." },
    { slug: "modern-architecture", title: "Modern Architecture", authorName: "Sarah Jenkins", price: 175000, imageUrl: defaultImg, categoryName: "Art & Design Theory", synopsis: "A comprehensive look at architectural movements of the 21st century." },
    { slug: "the-midnight-library", title: "The Midnight Library", authorName: "Matt Haig", price: 165000, originalPrice: 210000, imageUrl: img5, badge: "Best Seller", isFeaturedBestseller: true, categoryName: "Contemporary Fiction", pages: 304, synopsis: "Between life and death there is a library, and within that library, the shelves go on forever." },
    { slug: "klara-and-the-sun", title: "Klara and the Sun", authorName: "Kazuo Ishiguro", price: 185000, imageUrl: img6, badge: "New", categoryName: "Contemporary Fiction", synopsis: "A thrilling and profound novel from the Nobel Prize winner." },
    { slug: "normal-people", title: "Normal People", authorName: "Sally Rooney", price: 150000, imageUrl: defaultImg, badge: "New", categoryName: "Contemporary Fiction", synopsis: "A captivating exploration of modern relationships and coming of age." },
    { slug: "the-secret-history", title: "The Secret History", authorName: "Donna Tartt", price: 210000, imageUrl: img2, categoryName: "Classic Literature", synopsis: "A modern classic combining brilliant character studies with a gripping murder mystery." },
    { slug: "a-little-life", title: "A Little Life", authorName: "Hanya Yanagihara", price: 250000, imageUrl: img3, badge: "New", categoryName: "Contemporary Fiction", synopsis: "A beautifully written, intensely moving narrative of four friends in New York City." },
    { slug: "norwegian-wood", title: "Norwegian Wood", authorName: "Haruki Murakami", price: 145000, imageUrl: img2, categoryName: "Classic Literature", synopsis: "A nostalgic story of loss and sexuality in 1960s Japan." },
    { slug: "to-the-lighthouse", title: "To the Lighthouse", authorName: "Virginia Woolf", price: 110000, imageUrl: img3, categoryName: "Classic Literature", synopsis: "A landmark novel of high modernism, centered on the Ramsay family." },
    { slug: "bumi-manusia", title: "Bumi Manusia", authorName: "Pramoedya Ananta Toer", price: 135000, imageUrl: img5, categoryName: "Classic Literature", synopsis: "The first volume of the Buru Quartet, a sweeping novel of colonial Java." },
    { slug: "cantik-itu-luka", title: "Cantik Itu Luka", authorName: "Eka Kurniawan", price: 125000, imageUrl: img4, categoryName: "Contemporary Fiction", synopsis: "A tale of beauty, desire, and revenge spanning generations." },
  ];

  for (const b of booksData) {
    const existing = await prisma.book.findUnique({ where: { slug: b.slug } });
    if (existing) continue;
    await prisma.book.create({
      data: {
        slug: b.slug,
        title: b.title,
        price: b.price,
        originalPrice: b.originalPrice || null,
        imageUrl: b.imageUrl,
        badge: b.badge || null,
        synopsis: b.synopsis,
        pages: b.pages || null,
        status: "Active",
        isFeaturedBestseller: b.isFeaturedBestseller || false,
        authorId: authors[b.authorName],
        publisherId: publishers["Penguin Books"],
        categoryId: categories[b.categoryName],
      },
    });
  }
  console.log("✓ Books seeded");

  // ─── BOOK-GENRE RELATIONSHIPS ──────────────────────
  const genreMap: Record<string, number> = {};
  for (const g of await prisma.genre.findMany()) genreMap[g.name] = g.id;

  const bookGenreAssignments: Record<string, string[]> = {
    "whispers-in-the-wind": ["Romance", "Fiction"],
    "the-art-of-stillness": ["Self-Help", "Psychology"],
    "echoes-of-the-past": ["Fiction", "History"],
    "urban-landscapes": ["Design", "Philosophy"],
    "the-silent-observer": ["Fiction", "Psychology"],
    "design-philosophy": ["Design", "Philosophy"],
    "beyond-the-horizon": ["Fiction"],
    "modern-architecture": ["Design"],
    "the-midnight-library": ["Fiction", "Philosophy", "Self-Help"],
    "klara-and-the-sun": ["Fiction", "Science"],
    "normal-people": ["Romance", "Fiction"],
    "the-secret-history": ["Fiction", "History"],
    "a-little-life": ["Fiction", "Psychology"],
    "norwegian-wood": ["Romance", "Fiction"],
    "to-the-lighthouse": ["Fiction", "Poetry"],
    "bumi-manusia": ["Fiction", "History"],
    "cantik-itu-luka": ["Fiction", "History"],
  };

  for (const [slug, genreNames] of Object.entries(bookGenreAssignments)) {
    const book = await prisma.book.findUnique({ where: { slug } });
    if (!book) continue;
    for (const gName of genreNames) {
      const gId = genreMap[gName];
      if (!gId) continue;
      await prisma.bookGenre.upsert({
        where: { bookId_genreId: { bookId: book.id, genreId: gId } },
        update: {},
        create: { bookId: book.id, genreId: gId },
      });
    }
  }
  console.log("✓ Book-Genre relationships seeded");

  // ─── ARTICLES ──────────────────────────────────────
  const articlesData = [
    { slug: "the-lost-art-of-reading", title: "The Lost Art of Reading", excerpt: "Why deep reading matters more than ever in the age of distraction.", content: "<p>In a world of infinite scrolling and constant notifications, the simple act of sitting down with a physical book has become almost revolutionary.</p><h2>The Decline of Deep Reading</h2><p>Studies show that our attention spans have been shrinking. The average person now reads for just 15 minutes a day.</p>", categoryName: "Featured", isFeatured: true, status: "Published" },
    { slug: "interview-with-sally-rooney", title: "Interview with Sally Rooney", excerpt: "The acclaimed author discusses her writing process and the themes of her latest work.", content: "<p>Sally Rooney sits across from us in a small Dublin café. She speaks about the creative process with a candor that matches her prose.</p>", categoryName: "Interview", status: "Published" },
    { slug: "why-bookstores-matter", title: "Why Bookstores Matter", excerpt: "In a digital age, the value of physical bookstores transcends commerce.", content: "<p>There is something irreplaceable about walking into a bookstore. The smell of paper, the quiet hum of shared solitude.</p>", categoryName: "Editorial Essay", status: "Published" },
    { slug: "best-fiction-2024", title: "Best Fiction of 2024", excerpt: "Our editors pick the most compelling novels published this year.", content: "<p>From debut novelists to established masters, 2024 has been a remarkable year for fiction.</p>", categoryName: "Book Review", status: "Published" },
    { slug: "reading-as-resistance", title: "Reading as Resistance", excerpt: "How literature becomes a form of quiet rebellion in turbulent times.", content: "<p>Throughout history, the act of reading has been an act of defiance.</p>", categoryName: "Editorial Essay", status: "Published" },
    { slug: "the-future-of-independent-publishing", title: "The Future of Independent Publishing", excerpt: "Small presses are reshaping the literary landscape with bold new voices.", content: "<p>Independent publishers are proving that small can be powerful.</p>", categoryName: "News", status: "Published" },
  ];

  for (const a of articlesData) {
    const existing = await prisma.article.findUnique({ where: { slug: a.slug } });
    if (existing) continue;
    await prisma.article.create({
      data: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        imageUrl: defaultImg,
        readTime: Math.floor(Math.random() * 8) + 3,
        status: a.status,
        isFeatured: a.isFeatured || false,
        categoryId: artCategories[a.categoryName],
        publishedAt: new Date(),
      },
    });
  }
  console.log("✓ Articles seeded");

  // ─── TESTIMONIALS ──────────────────────────────────
  await prisma.testimonial.createMany({
    data: [
      { name: "Anindya Putri", city: "Jakarta", rating: 5, text: "Kedai Sinau is my sanctuary. The curation is impeccable — every book I've found here has left a lasting impression. It's not just a store, it's a cultural experience.", order: 0 },
      { name: "Bimo Wicaksono", city: "Bandung", rating: 5, text: "The editorial approach to bookselling is refreshing. I love how each book is presented with context and intention, not just as a product on a shelf.", order: 1 },
      { name: "Citra Maharani", city: "Yogyakarta", rating: 5, text: "From the packaging to the reading recommendations, everything about Kedai Sinau speaks of care and intentionality. A true gem for book lovers.", order: 2 },
    ],
    skipDuplicates: true,
  });
  console.log("✓ Testimonials seeded");

  // ─── BANNERS ───────────────────────────────────────
  await prisma.banner.createMany({
    data: [
      { imageUrl: defaultImg, altText: "New Collection — Spring 2024", order: 0 },
      { imageUrl: img2, altText: "Bestsellers of the Month", order: 1 },
      { imageUrl: img5, altText: "Independent Press Showcase", order: 2 },
    ],
    skipDuplicates: true,
  });
  console.log("✓ Banners seeded");

  // ─── STORE SETTINGS ────────────────────────────────
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "Kedai Sinau.",
      description: "A curated bookstore for the thoughtful reader. We believe in the power of literature to transform minds and nourish souls.",
      whatsapp: "+62812-3456-7890",
      email: "hello@kedaisinau.com",
      address: "Jl. Malioboro No. 42, Yogyakarta, Indonesia 55271",
      instagramUrl: "https://instagram.com/kedaisinau",
      shopeeUrl: "https://shopee.co.id/kedaisinau",
      aboutHeroImage: defaultImg,
      storeStory: "Founded in 2020 in the heart of Yogyakarta, Kedai Sinau began as a small reading room with a modest collection of hand-picked titles. Our name — meaning 'Learning Corner' in Javanese — reflects our belief that every book is a doorway to understanding.",
      visionStatement: "To be Southeast Asia's most thoughtful independent bookstore, where every title is chosen with intention and every reader finds their next transformative read.",
      missionPoints: JSON.stringify([
        "Curate collections that challenge and inspire",
        "Support independent publishers and local authors",
        "Create spaces for literary discourse and community",
        "Make quality literature accessible to all readers",
      ]),
    },
  });
  console.log("✓ Store Settings seeded");

  console.log("\n🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
