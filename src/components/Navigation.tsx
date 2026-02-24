import { NavLink } from "@/components/NavLink";
import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/writings", label: "Writings" },
    { path: "/projects", label: "Software" },
    { path: "/artifacts", label: "Artifacts" },
    { path: "/guestbook", label: "Guestbook" },
    ...(import.meta.env.VITE_SHOW_CV === "true" ? [{ path: "/cv", label: "CV" }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 md:left-[52px] right-0 h-16 flex items-center justify-between px-6 md:px-10 z-50 border-b border-border bg-background">
      <div className="flex w-full justify-between items-center">
        <span className="font-body font-bold text-[0.85rem] tracking-[0.25em] uppercase text-foreground md:hidden">KYGRA</span>
        <ul className="hidden md:flex gap-10 items-center list-none m-0 p-0">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className="font-body text-[0.7rem] tracking-[0.2em] uppercase text-foreground opacity-65 hover:opacity-100 transition-opacity duration-150 no-underline"
                activeClassName="opacity-100 font-bold"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navigation;
