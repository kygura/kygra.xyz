import { useEffect, useRef, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Lenis only smooths wheel input. On touch devices it contributes an
    // rAF loop every frame and nothing else, while competing with native
    // momentum scrolling — so it is not started there, nor when the
    // visitor has asked for reduced motion.
    const hasMM = typeof window.matchMedia === "function";
    const skip =
      hasMM &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (skip) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // The rAF chain has to be cancellable, or a destroyed Lenis keeps
    // being ticked for the life of the page.
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [location.pathname]);

  return <>{children}</>;
}
