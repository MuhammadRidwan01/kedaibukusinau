import Link from "next/link";
import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

async function getCachedSettings() {
  "use cache";
  cacheLife("hours");
  cacheTag("store-settings");
  return await prisma.storeSettings.findFirst();
}

export function PublicFooter({ theme = "light" }: { theme?: "light" | "dark" }) {
  return (
    <Suspense fallback={null}>
      <FooterContent theme={theme} />
    </Suspense>
  );
}

async function FooterContent({ theme = "light" }: { theme?: "light" | "dark" }) {
  const settings = await getCachedSettings();

  const storeName = settings?.storeName || "Kedai Sinau.";
  const description = settings?.description || "An independent bookstore. We read, select, and sell good books.";
  const instagramUrl = settings?.instagramUrl || "#";
  const shopeeUrl = settings?.shopeeUrl || "#";
  const email = settings?.email || "hello@kedaisinau.com";
  const whatsappRaw = settings?.whatsapp || "+62 812-3456-7890";
  const whatsappNumber = whatsappRaw.replace(/[^0-9]/g, "");
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#";

  return (
    <>
      {/* WhatsApp Floating Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        aria-label="Chat via WhatsApp"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Chat with Us
      </a>

      {/* Footer */}
      <footer className={`${theme === "dark" ? "bg-transparent border-t border-theme-dark-text/10 mt-24" : "bg-surface-variant/30 border-t border-outline-variant"}`}>
        <div className="w-full py-20 px-6 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="flex flex-col gap-6 md:col-span-1">
            <div className={`text-2xl font-bold font-newsreader tracking-tight ${theme === "dark" ? "text-theme-dark-text" : "text-on-surface"}`}>
              {storeName}
            </div>
            <p className={`font-newsreader italic text-base leading-relaxed ${theme === "dark" ? "text-theme-dark-text/70" : "text-on-surface-variant"}`}>
              {description}
            </p>
            <div className="flex gap-5 mt-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={`${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"} transition-transform hover:scale-110 duration-200`}
                title="Instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className={`${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"} transition-transform hover:scale-110 duration-200`}
                title="WhatsApp"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href={shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shopee"
                className={`${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"} transition-transform hover:scale-110 duration-200`}
                title="Shopee"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                  <text
                    x="12"
                    y="16.5"
                    fontFamily="Arial, sans-serif"
                    fontSize="8"
                    fontWeight="900"
                    fill="currentColor"
                    textAnchor="middle"
                    stroke="none"
                  >
                    S
                  </text>
                </svg>
              </a>
              {settings?.tiktokUrl && (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className={`${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"} transition-transform hover:scale-110 duration-200`}
                  title="TikTok"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.15 4.34-2.82 5.83-1.64 1.48-3.9 2.21-6.14 1.95-2.22-.24-4.22-1.35-5.59-3.08-1.39-1.74-1.92-4.04-1.44-6.2.49-2.2 1.92-4.08 3.88-5.06 1.17-.59 2.49-.87 3.8-.82v4.06c-.84.05-1.68.32-2.39.81-.8.56-1.31 1.45-1.41 2.42-.11 1.05.27 2.11.99 2.87.73.78 1.83 1.16 2.91 1.05 1.08-.1 2.05-.71 2.58-1.62.4-.69.58-1.48.58-2.28V.02z" />
                  </svg>
                </a>
              )}
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className={`${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"} transition-transform hover:scale-110 duration-200`}
                  title="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className={`font-newsreader text-sm uppercase tracking-[0.2em] mb-4 ${theme === "dark" ? "text-theme-dark-text" : "text-on-surface"}`}>
              Explore
            </h4>
            <Link
              className={`font-newsreader text-sm transition-colors duration-200 ${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"}`}
              href="/"
            >
              Home
            </Link>
            <Link
              className={`font-newsreader text-sm transition-colors duration-200 ${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"}`}
              href="/catalog"
            >
              Collections
            </Link>
            <Link
              className={`font-newsreader text-sm transition-colors duration-200 ${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"}`}
              href="/new-releases"
            >
              New Releases
            </Link>
            <Link
              className={`font-newsreader text-sm transition-colors duration-200 ${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"}`}
              href="/journal"
            >
              The Journal
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className={`font-newsreader text-sm uppercase tracking-[0.2em] mb-4 ${theme === "dark" ? "text-theme-dark-text" : "text-on-surface"}`}>
              Support
            </h4>
            <Link
              className={`font-newsreader text-sm transition-colors duration-200 ${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"}`}
              href="#"
            >
              How to Order
            </Link>
            <Link
              className={`font-newsreader text-sm transition-colors duration-200 ${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"}`}
              href="#"
            >
              Shipping Info
            </Link>
            <Link
              className={`font-newsreader text-sm transition-colors duration-200 ${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"}`}
              href="#"
            >
              Returns
            </Link>
            <Link
              className={`font-newsreader text-sm transition-colors duration-200 ${theme === "dark" ? "text-theme-dark-text/70 hover:text-primary" : "text-on-surface-variant hover:text-primary"}`}
              href="#"
            >
              Terms & Conditions
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className={`font-newsreader text-sm uppercase tracking-[0.2em] mb-4 ${theme === "dark" ? "text-theme-dark-text" : "text-on-surface"}`}>
              Visit Us
            </h4>
            <p className={`font-newsreader italic text-sm leading-relaxed ${theme === "dark" ? "text-theme-dark-text/70" : "text-on-surface-variant"}`}>
              {settings?.address ? (
                settings.address.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              ) : (
                <>
                  [Street Name / Full Address]<br />
                  [District, City / Regency]<br />
                  [Postal Code, Province]
                </>
              )}
            </p>
            <div className={`w-8 h-[1px] my-2 ${theme === "dark" ? "bg-theme-dark-text/30" : "bg-outline-variant"}`}></div>
            <p className={`font-newsreader italic text-sm ${theme === "dark" ? "text-theme-dark-text/70" : "text-on-surface-variant"}`}>
              {email}
              <br />
              {whatsappRaw}
            </p>
          </div>
          <div className={`md:col-span-4 pt-12 mt-4 border-t text-center ${theme === "dark" ? "border-theme-dark-text/10" : "border-outline-variant/50"}`}>
            <p className={`font-newsreader uppercase tracking-widest text-xs ${theme === "dark" ? "text-theme-dark-text/50" : "text-on-surface-variant"}`}>
              © 2026 {storeName} All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
