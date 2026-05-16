import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="text-on-surface antialiased min-h-screen flex bg-background">
      <div className="noise-overlay"></div>
      <AdminSidebar />
      <main className="flex-1 px-8 lg:px-16 py-12 lg:py-16 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
