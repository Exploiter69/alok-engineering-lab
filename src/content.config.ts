import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const commonSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
  status: z.enum(["draft", "active", "archived", "published"]).default("draft"),
});

const evidenceCollection = defineCollection({
    loader: glob({ base: "./src/content/evidence", pattern: "**/*.(md|mdx)" }),
    schema: commonSchema.extend({
      kind: z.enum(["benchmark", "failure", "verification", "observation"]),
      outcome: z.enum(["confirmed", "failed", "inconclusive", "informational"]),
      method: z.string(),
      result: z.string(),
      limitations: z.array(z.string()).default([]),
    }),
  });

export const collections = {
  projects: defineCollection({
    loader: glob({ base: "./src/content/projects", pattern: "**/*.(md|mdx)" }),
    schema: commonSchema.extend({
      stack: z.array(z.string()).default([]),
      repository: z.string().url().optional(),
      objective: z.string().optional(),
      lifecycle: z.enum(["exploring", "building", "maintaining", "archived"]).default("exploring"),
      lifecycleSince: z.coerce.date().optional(),
      lifecycleHistory: z.array(z.object({
        state: z.enum(["exploring", "building", "maintaining", "archived"]),
        date: z.coerce.date(),
        note: z.string(),
      })).default([]),
      architectureSummary: z.string().optional(),
      decisions: z.array(z.string()).default([]),
      lessons: z.array(z.string()).default([]),
    }),
  }),
  writing: defineCollection({
    loader: glob({ base: "./src/content/writing", pattern: "**/*.(md|mdx)" }),
    schema: commonSchema.extend({
      format: z.enum(["essay", "case-study", "guide", "postmortem", "reference"]).default("essay"),
      audience: z.string().optional(),
    }),
  }),
  notes: defineCollection({
    loader: glob({ base: "./src/content/notes", pattern: "**/*.(md|mdx)" }),
    schema: commonSchema.extend({
      stage: z.enum(["seedling", "budding", "evergreen"]).default("seedling"),
    }),
  }),
  experiments: defineCollection({
    loader: glob({ base: "./src/content/experiments", pattern: "**/*.(md|mdx)" }),
    schema: commonSchema,
  }),
  timeline: defineCollection({
    loader: glob({ base: "./src/content/timeline", pattern: "**/*.(md|mdx)" }),
    schema: commonSchema,
  }),
  evidence: evidenceCollection,
  changelog: defineCollection({
    loader: glob({ base: "./src/content/changelog", pattern: "**/*.(md|mdx)" }),
    schema: commonSchema,
  }),
};
