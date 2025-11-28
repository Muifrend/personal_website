// src/content/config.ts
import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(), // Forces you to have a valid date
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      cover: image().optional(),
    }),
});

export const collections = { projectsCollection };
