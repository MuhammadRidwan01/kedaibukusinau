import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Kedai Sinau. Send us a message, visit our store, or reach out via WhatsApp and email.",
};

async function getCachedSettings() {
  "use cache";
  cacheLife("hours");
  cacheTag("store-settings");
  return await prisma.storeSettings.findFirst();
}


export default async function ContactPage() {
  const settings = await getCachedSettings();
  const instagramUrl = settings?.instagramUrl || "#";
  const shopeeUrl = settings?.shopeeUrl || "#";
  return (
    <>
      <PublicNavbar />

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-16">
          <div className="flex items-center gap-2 font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-on-surface font-semibold border-b border-primary">Contact Us</span>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-16 border-b border-outline-variant/50 pb-12">
          <h1 className="font-display-lg text-4xl sm:text-6xl md:text-7xl text-on-surface tracking-tight mb-4">Get in Touch.</h1>
          <p className="font-newsreader italic text-lg sm:text-xl md:text-2xl text-on-surface-variant max-w-2xl">
            We're always open to conversation. Send us a message or visit us in person.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">

          {/* Contact Info (Left Column) */}
          <div className="lg:col-span-4 flex flex-col gap-16">
            {/* Address */}
            <div>
              <h3 className="font-label-sm uppercase tracking-[0.2em] text-primary mb-6">Visit Us</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed text-lg">
                {settings?.address}
              </p>
            </div>

            {/* Direct Contact */}
            <div>
              <h3 className="font-label-sm uppercase tracking-[0.2em] text-primary mb-6">Direct Contact</h3>
              <div className="flex flex-col gap-5">
                <a href={`mailto:${settings?.email}`} className="font-body-md text-on-surface-variant hover:text-primary transition-colors text-lg flex items-center gap-4 group">
                  <span className="material-symbols-outlined font-light text-[24px] group-hover:scale-110 transition-transform">mail</span>
                  {settings?.email}
                </a>
                {/* Tap to Chat WA Link */}
                <a href={`https://wa.me/${settings?.whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-body-md text-on-surface-variant hover:text-primary transition-colors text-lg flex items-center gap-4 group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  WhatsApp ({settings?.whatsapp})
                </a>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h3 className="font-label-sm uppercase tracking-[0.2em] text-primary mb-6">Follow & Shop</h3>
              <div className="flex gap-6">
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-on-surface-variant hover:text-primary transition-transform hover:scale-110 duration-200" title="Instagram">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
                <a href={shopeeUrl} target="_blank" rel="noopener noreferrer" aria-label="Shopee" className="text-on-surface-variant hover:text-primary transition-transform hover:scale-110 duration-200" title="Shopee">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /><text x="12" y="16.5" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="900" fill="currentColor" textAnchor="middle" stroke="none">S</text></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Form (Right Column) */}
          <div className="lg:col-span-8 bg-surface border border-outline-variant/50 p-5 sm:p-8 md:p-12 shadow-sm relative">
            {/* Decorative Corner Lines */}
            <div className="absolute top-4 left-4 w-4 h-[1px] bg-outline-variant"></div>
            <div className="absolute top-4 left-4 w-[1px] h-4 bg-outline-variant"></div>
            <div className="absolute bottom-4 right-4 w-4 h-[1px] bg-outline-variant"></div>
            <div className="absolute bottom-4 right-4 w-[1px] h-4 bg-outline-variant"></div>

            <form className="flex flex-col gap-10">

              {/* Grid for Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-3">
                  <label htmlFor="name" className="font-label-sm uppercase tracking-widest text-xs text-on-surface-variant">Name</label>
                  <input type="text" id="name" name="name" className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface-variant/30 transition-colors" placeholder="e.g., Sally Rooney" required />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="email" className="font-label-sm uppercase tracking-widest text-xs text-on-surface-variant">Email</label>
                  <input type="email" id="email" name="email" className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface-variant/30 transition-colors" placeholder="sally@example.com" required />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="subject" className="font-label-sm uppercase tracking-widest text-xs text-on-surface-variant">Subject</label>
                <select id="subject" name="subject" className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 font-body-md text-on-surface transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=\'http://www.w3.org/2000/svg\'%20fill=\'none\'%20viewBox=\'0%200%2020%2020\'><path%20stroke=\'%231E3A5F\'%20stroke-linecap=\'round\'%20stroke-linejoin=\'round\'%20stroke-width=\'1.5\'%20d=\'M6%208l4%204%204-4\'/></svg>')] bg-no-repeat bg-[position:right_0_center] bg-[length:1.5em_1.5em] pr-6">
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="partnership">Author / Publisher Partnership</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="message" className="font-label-sm uppercase tracking-widest text-xs text-on-surface-variant">Message</label>
                <textarea id="message" name="message" rows={5} className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface-variant/30 transition-colors resize-none" placeholder="How can we assist your reading journey?" required></textarea>
              </div>

              <button type="submit" className="mt-4 self-start inline-flex items-center gap-3 px-10 py-5 bg-transparent border border-on-surface text-on-surface font-label-sm uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-colors duration-300">
                Send Message
                <span className="material-symbols-outlined text-[20px]">arrow_right_alt</span>
              </button>
            </form>
          </div>

        </div>

      </main>

      <PublicFooter />
    </>
  );
}

