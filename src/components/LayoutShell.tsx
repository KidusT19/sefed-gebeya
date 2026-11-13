"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  if (isAdmin) {
    return <div className="min-h-screen w-full bg-slate-950 text-slate-100">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <main className={isHome ? "flex-1 w-full pb-20 sm:pb-0" : "flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-24 sm:pb-6"}>
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
