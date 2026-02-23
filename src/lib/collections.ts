import { getCollection } from "astro:content";

// Supported locales
const locales = ["en", "vi", "ru", "et", "da", "tr", "zh", "pl", "sv", "fi", "tok", "vi-Hani"] as const;
type Locale = (typeof locales)[number];

// --- Types (mirror the Zod schemas in config.ts) ---

export type I18nContent = Record<Locale, string>;
export type I18nContentOptional = { en: string } & Partial<Record<Exclude<Locale, "en">, string>>;

export type NowItem = {
  id: number;
  category: string;
  icon: string;
  image?: string;
  content: I18nContent;
  contentSecondary?: I18nContentOptional;
  date: string;
};

export type ProjectFields = {
  title: string;
  description: string;
  what: string;
  learned: string;
  why: string;
};

export type Project = {
  id: number;
  content: Record<string, ProjectFields>;
  tags: string[];
  status: "completed" | "in-progress" | "planned";
  category: "personal" | "academic" | "activism";
  hidden?: boolean;
};

export type UsesItem = {
  name: string;
  descriptionKey?: string;
  description?: string;
  link?: string;
};

export type UsesCategory = {
  title: string;
  icon: string;
  items: UsesItem[];
  subsections?: { title: string; icon?: string; items: UsesItem[] }[];
};

export type WebringItem = {
  name: string;
  url: string;
  previous: string;
  random: string | null;
  next: string;
  description?: string;
  status: "active" | "pending";
};

// --- Type-safe collection data fetcher ---

type DataMap = {
  now: NowItem;
  projects: Project;
  uses: UsesCategory;
  webrings: WebringItem;
};

/** Fetch a data collection and return the `.data` array, fully typed. */
export async function getData<C extends keyof DataMap>(name: C): Promise<DataMap[C][]> {
  const entries = await getCollection(name);
  return entries.map((e: { data: DataMap[C] }) => e.data);
}
