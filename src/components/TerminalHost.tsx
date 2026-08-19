import { lazy, Suspense, useEffect, useState } from "react";

const Terminal = lazy(() =>
  import("./Terminal").then((m) => ({ default: m.Terminal }))
);

/**
 * Keeps the terminal out of the initial bundle. Only the shortcut listener
 * ships on first load; the panel — themes, command table, syntax colours —
 * is fetched the first time someone actually reaches for it.
 */
export default function TerminalHost() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (armed) return; // Terminal owns the shortcut from here on.
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "k") || e.key === "`") {
        e.preventDefault();
        setArmed(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [armed]);

  if (!armed) return null;

  return (
    <Suspense fallback={null}>
      <Terminal defaultOpen />
    </Suspense>
  );
}
