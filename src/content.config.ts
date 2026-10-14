import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      cover: image().optional(),
      repo: z.url().optional(),
      link_url: z.url().optional(),
      link_file: z.string().optional(),
      link_text: z.string().optional(),
      links: z.array(z.object({
        label: z.string().trim().min(1),
        url: z.url(),
      })).optional(),
    }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    // Keep publication dates as text so month-only dates don't gain an invented day.
    date: z.union([
      z.iso.date(),
      z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    ]),
    topics: z.array(z.string()),
    url: z.url().refine((value) => new URL(value).protocol === "https:", {
      message: "Blog links must use HTTPS.",
    }),
  }),
});

export const collections = { projectsCollection, blogCollection };
