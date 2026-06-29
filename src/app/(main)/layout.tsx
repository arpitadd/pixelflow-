import { Navbar } from "@/components/navbar/Navbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { MobileNav } from "@/components/navbar/MobileNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 md:p-6 max-w-3xl lg:max-w-none mx-auto w-full">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
