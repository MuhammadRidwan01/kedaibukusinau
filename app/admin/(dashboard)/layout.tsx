import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "sonner";
import { Suspense } from "react";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="text-on-surface antialiased h-screen flex bg-background overflow-hidden">
      <div className="noise-overlay"></div>
      <Toaster position="top-right" richColors closeButton />
      <AdminSidebar />
      <main className="flex-1 px-8 lg:px-16 py-12 lg:py-16 overflow-y-auto">
        <Suspense fallback={<div className="p-8 text-zinc-500">Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
