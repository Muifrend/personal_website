// src/content/config.ts
import { z, defineCollection } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(), // Forces you to have a valid date
    description: z.string().optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
};