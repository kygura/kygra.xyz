import { useRef, useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "./ThemeToggle";
import Header from "./Header";

const Navigation = () => {
  const shadowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !shadowRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Calculate dramatic parallax effect
      shadowRef.current.style.transform = `translate(${8 + x * 20}px, ${8 + y * 20}px)`;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/writings", label: "Writings" },
    { path: "/projects", label: "Software" },
    { path: "/guestbook", label: "Guestbook" },
    { path: "/cv", label: "CV" }
  ];

  return (
    <nav className="py-8 px-6 md:px-12 lg:px-16">
      <div className="flex justify-between items-center gap-4 md:gap-8">
        <ul className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8 items-center">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className="px-4 py-1.5 transition-colors duration-200 uppercase whitespace-nowrap text-background hover:bg-background hover:text-foreground no-underline"
                activeClassName="!bg-background !text-foreground"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      
    </div>
  );
};

export default Navigation;
