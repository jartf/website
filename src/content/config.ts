// Content Collections configuration
// https://docs.astro.build/en/guides/content-collections/

import { defineCollection, z } from "astro:content";

// Supported locales (shared shape for i18n content)
const locales = ["en", "vi", "ru", "et", "da", "tr", "zh", "pl", "sv", "fi", "tok", "vi-Hani"] as const;
type Locale = (typeof locales)[number];

// i18n schemas
const i18nContent = z.object(Object.fromEntries(locales.map(l => [l, z.string()])) as Record<Locale, z.ZodString>);
const i18nContentOptional = z.object(
  Object.fromEntries(locales.map(l => [l, l === "en" ? z.string() : z.string().optional()])) as
    { en: z.ZodString } & Record<Exclude<Locale, "en">, z.ZodOptional<z.ZodString>>
);

// Shared item schema (name + optional description/link)
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

// --- Collection definitions ---

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
