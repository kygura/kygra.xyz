import { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full h-1.5 bg-destructive"></div>
      <Navigation />
      <main className="flex-grow">{children}</main>
      <div className="torn-top !bg-foreground scale-y-[-1]"></div>
      <Footer />
    </div>
  );
};

export default Layout;
