// Shared theme cycling utility
import { themes } from "@/lib/constants";

export function applyTheme(theme: string) {
  localStorage.setItem("theme", theme);
  document.documentElement.classList.remove("light", "dark");
  const resolved = theme === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;
  document.documentElement.classList.add(resolved);
  document.documentElement.style.colorScheme = resolved;
}

export function cycleTheme() {
  const current = localStorage.getItem("theme") || "dark";
  const idx = themes.indexOf(current as any);
  applyTheme(themes[(idx + 1) % themes.length]);
}
