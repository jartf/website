import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/" && pathname !== "/") return false;
  return pathname === href || pathname.startsWith(href);
}
