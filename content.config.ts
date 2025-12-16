import { defineCollection, z } from "astro:content";

export const collections = {
  questions: defineCollection({
    schema: z.object({}),
  }),
};
