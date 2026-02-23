// Content Collections
// https://docs.astro.build/en/guides/content-collections/

import { defineCollection, z, getCollection } from "astro:content";
import { supportedLanguages } from "@/lib/constants";
type Locale = (typeof supportedLanguages)[number]["code"];
const localeCodes = supportedLanguages.map(l => l.code);

const i18nContent = z.object(Object.fromEntries(localeCodes.map(l => [l, z.string()])) as Record<Locale, z.ZodString>);
const i18nContentOptional = z.object(
  Object.fromEntries(localeCodes.map(l => [l, l === "en" ? z.string() : z.string().optional()])) as
    { en: z.ZodString } & Record<Exclude<Locale, "en">, z.ZodOptional<z.ZodString>>
);

const usesItem = z.object({
  name: z.string(),
  descriptionKey: z.string().optional(),
  description: z.string().optional(),
  link: z.string().optional(),
});

const projectFields = z.object({
  title: z.string(),
  description: z.string(),
  what: z.string(),
  learned: z.string(),
  why: z.string(),
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    mood: z.string().default("contemplative"),
    catApproved: z.boolean().default(true),
    readingTime: z.number().optional(),
    language: z.string().default("en"),
    tags: z.array(z.string()).optional(),
    category: z.string().nullable().optional(),
    draft: z.boolean().default(false),
    alternates: z.array(z.object({ language: z.string(), slug: z.string() })).optional(),
  }),
});

const scrapbook = defineCollection({
  type: "data",
  schema: z.object({ date: z.coerce.date(), content: i18nContentOptional }),
});

const now = defineCollection({
  type: "data",
  schema: z.object({
    id: z.number(),
    category: z.string(),
    icon: z.string(),
    image: z.string().optional(),
    content: i18nContent,
    contentSecondary: i18nContentOptional.optional(),
    date: z.string(),
  }),
});

const projects = defineCollection({
  type: "data",
  schema: z.object({
    id: z.number(),
    content: z.record(z.string(), projectFields),
    tags: z.array(z.string()),
    status: z.enum(["completed", "in-progress", "planned"]),
    category: z.enum(["personal", "academic", "activism"]),
    hidden: z.boolean().optional(),
  }),
});

const uses = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    icon: z.string(),
    items: z.array(usesItem),
    subsections: z.array(z.object({
      title: z.string(),
      icon: z.string().optional(),
      items: z.array(usesItem),
    })).optional(),
  }),
});

const webrings = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    url: z.string(),
    previous: z.string(),
    random: z.string().nullable(),
    next: z.string(),
    description: z.string().optional(),
    status: z.enum(["active", "pending"]),
  }),
});

export const collections = { blog, scrapbook, now, projects, uses, webrings };
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

type DataMap = {
  now: NowItem;
  projects: Project;
  uses: UsesCategory;
  webrings: WebringItem;
};

export async function getData<C extends keyof DataMap>(name: C): Promise<DataMap[C][]> {
  const entries = await getCollection(name);
  return entries.map((e: { data: DataMap[C] }) => e.data);
}
