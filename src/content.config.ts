import { defineCollection } from "astro:content";
import { questionFrontmatterSchema } from "@/lib/question-schema.js";

export const collections = {
  questions: defineCollection({
    schema: questionFrontmatterSchema,
  }),
};
