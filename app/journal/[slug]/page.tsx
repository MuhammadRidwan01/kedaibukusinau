import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BookCard } from "@/components/ui/BookCard";
import Link from "next/link";

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  // Mock data
  const article = {
    title: "The Modern Return to Minimalist Literature",
    date: "May 12, 2026",
    readTime: "8 min read",
    category: "Featured",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=1200&auto=format&fit=crop",
    content: [
      {
        type: "paragraph",
        text: "In an era defined by endless digital noise and maximalist content, readers are increasingly turning toward minimalist prose. We are witnessing a quiet revolution in publishing—a movement away from sprawling, multi-perspective epics and a return to tight, focused, and emotionally resonant storytelling.",
        dropCap: true,
      },
      {
        type: "paragraph",
        text: "The allure of minimalism isn't just aesthetic; it's psychological. When the world feels overwhelming, the crisp, unadorned sentences of authors like Sally Rooney or the late Raymond Carver offer a sanctuary of clarity. They don't tell us how to feel; they present the raw materials of human interaction and trust the reader to assemble the emotional weight.",
      },
      {
        type: "heading",
        text: "The End of Excess",
      },
      {
        type: "paragraph",
        text: "Consider the meteoric rise of \"Normal People.\" Rooney's prose is famously stripped back. There are no quotation marks to cushion dialogue, no lengthy physical descriptions to anchor the setting. Instead, the focus is entirely on the interstitial spaces between characters—the things left unsaid.",
      },
      {
        type: "blockquote",
        text: "Minimalism is not a lack of something. It is simply the perfect amount of something.",
      },
      {
        type: "paragraph",
        text: "This approach requires immense restraint. Writing a minimalist novel is akin to constructing a suspension bridge: every word must bear weight. If one sentence fails, the entire structure sags. The key elements of this resurgence include:",
      },
      {
        type: "list",
        items: [
          "Absence of Exposition: Trusting the reader to understand the context through action rather than explanation.",
          "Focused Timelines: Confining the narrative to a few days, weeks, or a highly specific slice of life.",
          "Emotional Proximity: Using close third-person or first-person perspectives to eliminate narrative distance."
        ]
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&w=1200&auto=format&fit=crop",
        caption: "The traditional tools of the minimalist writer."
      },
      {
        type: "paragraph",
        text: "As we navigate a culture of overstimulation, the minimalist novel stands as an act of rebellion. It asks us to slow down, to read closely, and to find the profound within the mundane."
      }
    ]
  };

  const relatedArticles = [
    {
      id: "1",
      slug: "a-conversation-with-sally-rooney",
      title: "A Conversation with Sally Rooney",
      category: "Interview",
      date: "May 05, 2026",
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "2",
      slug: "analyzing-the-midnight-library",
      title: "Analyzing The Midnight Library",
      category: "Book Review",
      date: "Apr 28, 2026",
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const recommendedBooks = [
    {
      id: "1",
      slug: "normal-people",
      title: "Normal People",
      author: "Sally Rooney",
      price: 125000,
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "2",
      slug: "conversations-with-friends",
      title: "Conversations with Friends",
      author: "Sally Rooney",
      price: 135000,
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
      staggered: true,
    },
    {
      id: "3",
      slug: "cathedral",
      title: "Cathedral",
      author: "Raymond Carver",
      price: 150000,
      imageUrl: "https://images.unsplash.com/photo-1629196914225-83c70624cd8c?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "4",
      slug: "beautiful-world-where-are-you",
      title: "Beautiful World, Where Are You",
      author: "Sally Rooney",
      price: 140000,
      imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
      staggered: true,
    },
  ];

  return (
    <div className="bg-theme-dark-bg min-h-screen flex flex-col text-theme-dark-text theme-dark">
      <PublicNavbar theme="dark" />
      
      <main className="flex-grow w-full max-w-[1000px] mx-auto px-6 py-12">
        
        {/* Breadcrumb */}
        <div className="mb-16">
          <div className="flex items-center gap-2 font-label-sm text-theme-dark-text/60 uppercase tracking-widest text-[11px] flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <Link href="/journal" className="hover:text-primary transition-colors">The Journal</Link>
            <span className="opacity-50">/</span>
            <span className="text-theme-dark-text font-semibold border-b border-primary">{article.title}</span>
          </div>
        </div>

        {/* Article Header */}
        <div className="flex flex-col items-center text-center mb-16 max-w-[800px] mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-label-sm text-[9px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 bg-transparent text-theme-dark-text border border-theme-dark-text/40">{article.category}</span>
            <div className="flex items-center gap-2 font-newsreader italic text-sm text-theme-dark-text/60">
              <span>{article.date}</span>
              <span className="w-1 h-1 rounded-full bg-theme-dark-text/30"></span>
              <span>{article.readTime}</span>
            </div>
          </div>
          <h1 className="font-display-lg text-5xl md:text-6xl lg:text-7xl text-theme-dark-text tracking-tight leading-[1.1]">
            {article.title}
          </h1>
        </div>

        {/* Hero Image */}
        <div className="w-full relative mb-20 border border-theme-dark-text/10 shadow-lg">
          <img className="w-full aspect-video md:aspect-[21/9] object-cover grayscale" src={article.imageUrl} alt="Hero Image" />
        </div>

        {/* Article Content */}
        <div className="max-w-[700px] mx-auto font-body-md text-theme-dark-text/80 text-lg leading-loose space-y-8">
          {article.content.map((block, index) => {
            if (block.type === 'paragraph') {
              if (block.dropCap) {
                const firstChar = block.text.charAt(0);
                const restOfText = block.text.slice(1);
                return (
                  <p key={index}>
                    <span className="float-left text-7xl leading-none font-newsreader text-theme-dark-text mr-4 mt-2">{firstChar}</span>
                    {restOfText}
                  </p>
                );
              }
              return <p key={index}>{block.text}</p>;
            }
            if (block.type === 'heading') {
              return <h2 key={index} className="font-headline-h2 text-3xl md:text-4xl text-theme-dark-text mt-16 mb-6">{block.text}</h2>;
            }
            if (block.type === 'blockquote') {
              return (
                <blockquote key={index} className="border-l-[3px] border-primary pl-8 font-newsreader italic text-2xl md:text-3xl text-theme-dark-text my-16 leading-relaxed">
                  "{block.text}"
                </blockquote>
              );
            }
            if (block.type === 'list') {
              return (
                <ul key={index} className="list-disc pl-6 space-y-4 marker:text-primary">
                  {block.items?.map((item, i) => {
                    const colonIndex = item.indexOf(':');
                    if (colonIndex !== -1) {
                      return (
                        <li key={i}>
                          <strong>{item.substring(0, colonIndex + 1)}</strong>
                          {item.substring(colonIndex + 1)}
                        </li>
                      );
                    }
                    return <li key={i}>{item}</li>;
                  })}
                </ul>
              );
            }
            if (block.type === 'image') {
              return (
                <div key={index} className="w-full relative my-16 border border-theme-dark-text/10 shadow-lg">
                  <img className="w-full aspect-[16/9] object-cover grayscale" src={block.url} alt={block.caption} />
                  <p className="font-newsreader italic text-sm text-theme-dark-text/50 mt-4 text-center">{block.caption}</p>
                </div>
              );
            }
            return null;
          })}
        </div>

        <hr className="border-theme-dark-text/10 my-32 max-w-[700px] mx-auto" />

        {/* Related Articles */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="font-headline-h2 text-3xl md:text-4xl text-theme-dark-text italic">Continue Reading</h2>
            <div className="w-12 h-[1px] bg-primary mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-[900px] mx-auto">
            {relatedArticles.map((related) => (
              <Link href={`/journal/${related.slug}`} key={related.id} className="flex flex-col group cursor-pointer">
                <div className="relative overflow-hidden mb-6 border border-theme-dark-text/10">
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                  <img className="w-full aspect-[16/9] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" src={related.imageUrl} alt={related.title} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-label-sm text-[9px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 bg-transparent text-theme-dark-text border border-theme-dark-text/40">{related.category}</span>
                  <span className="font-newsreader italic text-[13px] text-theme-dark-text/60">{related.date}</span>
                </div>
                <h3 className="font-headline-h3 text-2xl text-theme-dark-text group-hover:text-primary transition-colors">{related.title}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Books */}
        <div>
          <div className="text-center mb-16">
            <h2 className="font-headline-h2 text-3xl md:text-4xl text-theme-dark-text italic">Books in this Essay</h2>
            <div className="w-12 h-[1px] bg-primary mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8">
            {recommendedBooks.map((book) => (
              <Link key={book.id} href={`/catalog/${book.slug}`} className={`flex flex-col gap-6 group cursor-pointer ${book.staggered ? 'md:mt-8' : ''}`}>
                <div className="relative p-4 bg-surface-bright/5 border border-theme-dark-text/10 shadow-sm transition-all duration-500 group-hover:-translate-y-2">
                  <img alt={book.title} className="book-cover w-full object-cover" src={book.imageUrl} />
                </div>
                <div className="flex flex-col gap-2 text-center">
                  <span className="font-label-sm text-[10px] uppercase tracking-[0.2em] text-theme-dark-text/60">{book.author}</span>
                  <h3 className="font-headline-h3 text-lg text-theme-dark-text line-clamp-2">{book.title}</h3>
                  <span className="font-newsreader font-semibold text-base text-primary mt-1">Rp {book.price.toLocaleString("id-ID")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>

      <PublicFooter theme="dark" />
    </div>
  );
}
