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

// Scrapbook collection
const scrapbookCollection = defineCollection({
  type: "content",
  schema: z.object({
    date: z.coerce.date(),
  }),
});

export const collections = {
  blog: blogCollection,
  scrapbook: scrapbookCollection,
};
