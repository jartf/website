// Shared theme cycling utility
import { themes } from "@/lib/constants";

export function cycleTheme() {
  const current = localStorage.getItem("theme") || "dark";
  const idx = themes.indexOf(current as any);
  const next = themes[(idx + 1) % themes.length];
  localStorage.setItem("theme", next);
  document.documentElement.classList.remove("light", "dark");
  if (next === "system") {
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.classList.add(sys);
    document.documentElement.style.colorScheme = sys;
  } else {
    document.documentElement.classList.add(next);
    document.documentElement.style.colorScheme = next;
  }
}

export function applyTheme(theme: string) {
  localStorage.setItem("theme", theme);
  document.documentElement.classList.remove("light", "dark");
  if (theme === "system") {
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.classList.add(sys);
    document.documentElement.style.colorScheme = sys;
  } else {
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  }
}
