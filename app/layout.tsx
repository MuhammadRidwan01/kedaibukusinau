import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { HoverPrefetch } from "@/components/common/HoverPrefetch";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Kedai Sinau | Curated Digital Bookstore",
    template: "%s | Kedai Sinau",
  },
  description: "Kedai Sinau - A curated index of titles that challenge the mind and soothe the soul.",
  keywords: ["bookstore", "digital books", "literature", "curated collection", "kedai sinau"],
  authors: [{ name: "Kedai Sinau Team" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Kedai Sinau",
    title: "Kedai Sinau | Curated Digital Bookstore",
    description: "Discover our curated collection of titles. Books that challenge the mind and soothe the soul.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kedai Sinau | Curated Digital Bookstore",
    description: "Discover our curated collection of titles.",
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${newsreader.variable} h-full antialiased light`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col text-on-surface">
        <HoverPrefetch />
        <div className="noise-overlay"></div>
        {children}
      </body>
    </html>
  );
}
