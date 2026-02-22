// Content Collections configuration
// https://docs.astro.build/en/guides/content-collections/

import { defineCollection, z } from "astro:content";

// Reusable i18n content schema (all languages required)
const i18nContent = z.object({
  en: z.string(),
  vi: z.string(),
  ru: z.string(),
  et: z.string(),
  da: z.string(),
  tr: z.string(),
  zh: z.string(),
  pl: z.string(),
  sv: z.string(),
  fi: z.string(),
  tok: z.string(),
  'vi-Hani': z.string(),
});

// Reusable i18n content schema (only en required)
const i18nContentOptional = z.object({
  en: z.string(),
  vi: z.string().optional(),
  ru: z.string().optional(),
  et: z.string().optional(),
  da: z.string().optional(),
  tr: z.string().optional(),
  zh: z.string().optional(),
  pl: z.string().optional(),
  sv: z.string().optional(),
  fi: z.string().optional(),
  tok: z.string().optional(),
  'vi-Hani': z.string().optional(),
});

// Blog posts collection
const blogCollection = defineCollection({
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
    alternates: z.array(z.object({
      language: z.string(),
      slug: z.string(),
    })).optional(),
  }),
});

// Scrapbook collection with i18n support
const scrapbookCollection = defineCollection({
  type: "data",
  schema: z.object({
    date: z.coerce.date(),
    content: i18nContentOptional,
  }),
});

// Now items collection
const nowCollection = defineCollection({
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

// Project fields schema
const projectFields = z.object({
  title: z.string(),
  description: z.string(),
  what: z.string(),
  learned: z.string(),
  why: z.string(),
});

// Projects collection
const projectsCollection = defineCollection({
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

// Uses collection
const usesCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    icon: z.string(),
    items: z.array(z.object({
      name: z.string(),
      descriptionKey: z.string().optional(),
      description: z.string().optional(),
      link: z.string().optional(),
    })),
    subsections: z.array(z.object({
      title: z.string(),
      icon: z.string().optional(),
      items: z.array(z.object({
        name: z.string(),
        descriptionKey: z.string().optional(),
        description: z.string().optional(),
        link: z.string().optional(),
      })),
    })).optional(),
  }),
});

// Webrings collection
const webringsCollection = defineCollection({
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

export const collections = {
  blog: blogCollection,
  scrapbook: scrapbookCollection,
  now: nowCollection,
  projects: projectsCollection,
  uses: usesCollection,
  webrings: webringsCollection,
};
