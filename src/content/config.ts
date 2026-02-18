// Content Collections configuration
// https://docs.astro.build/en/guides/content-collections/

import { defineCollection, z } from "astro:content";

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
    content: z.object({
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
    }),
  }),
});

export const collections = {
  blog: blogCollection,
  scrapbook: scrapbookCollection,
};
