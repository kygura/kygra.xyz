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
    <div className="relative p-6 sm:p-8 pb-4 border-b-4 border-foreground overflow-hidden animate-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-start flex-wrap gap-4">
        {/* LOGO BLOCK */}
        <div className="relative group select-none cursor-pointer">
          {/* Bottom layer (NICOLAS) */}
          <div className="absolute top-0 left-0 font-['UnifrakturMaguntia'] text-[clamp(4rem,12vw,9rem)] leading-[0.85] tracking-[-2px] z-0 opacity-50 text-destructive translate-x-[6px] translate-y-[6px] transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-foreground group-hover:z-20">
            KYGRA
          </div>
          {/* Top layer (KYGRA) */}
          <div className="font-['UnifrakturMaguntia'] text-[clamp(4rem,12vw,9rem)] leading-[0.85] tracking-[-2px] relative z-10 text-foreground transition-all duration-500 ease-in-out group-hover:translate-x-[6px] group-hover:translate-y-[6px] group-hover:opacity-50 group-hover:text-destructive group-hover:z-0">
            KYGRA
          </div>
        </div>

        {/* META INFO & THEME TOGGLE */}
        <div className="text-right text-[0.65rem] tracking-[0.1em] uppercase text-muted-foreground leading-[1.8] pt-2 flex flex-col items-end">
          <div className="flex items-center gap-4 mb-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <nav className="border-y-2 border-foreground py-1.5 px-4 sm:px-8 font-['Bebas_Neue'] text-sm sm:text-base tracking-[0.2em] sm:tracking-[0.3em] flex flex-wrap justify-between items-center bg-foreground text-background mt-4 gap-4">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 items-center w-full justify-center sm:justify-start">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className="transition-colors duration-200 uppercase whitespace-nowrap text-background hover:text-destructive no-underline"
                activeClassName="!text-destructive"
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
