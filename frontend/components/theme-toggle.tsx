"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex size-9 items-center justify-center opacity-50">
        <ThemeIcon />
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      <ThemeIcon dark={resolvedTheme === "dark"} />
    </button>
  );
}

function ThemeIcon({ dark = false }: { dark?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={dark ? "#f8fafc" : "#0f172a"}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-all duration-300"
    >
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M12 3v18" />
      <path d="M12 14l7 -7" />
      <path d="M12 19l8.5 -8.5" />
      <path d="M12 9l4.5 -4.5" />
    </svg>
  );
}