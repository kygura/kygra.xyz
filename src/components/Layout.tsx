import { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-body text-foreground">
      {/* FIXED LEFT RAIL */}
      <aside className="fixed left-0 top-0 bottom-0 w-[52px] hidden md:flex flex-col justify-between py-6 z-50 border-r border-border">
        <div
          className="font-body font-bold text-[0.9rem] tracking-[0.35em] uppercase text-foreground pl-[18px]"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
        >
          KYGRA
        </div>
        <div
          className="font-body text-[0.6rem] tracking-[0.2em] uppercase text-foreground/40 pl-[20px]"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
        >
          kygra.xyz
        </div>
      </aside>

      <Navigation />

      {/* MAIN CONTENT */}
      {/* 52px left margin on md+ screens to account for the rail */}
      {/* 64px top padding to account for the top nav (h-16) */}
      <main className="flex-grow md:ml-[52px] pt-16 flex flex-col">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
