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
    }),
});

export const collections = { projectsCollection };
