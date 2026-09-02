import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";


const commonSchema = z.object({
	title: z.string(),
	description: z.string(),
	date: z.coerce.date(),
	tags: z.array(z.string()).default([]),
	related: z.array(z.string()).default([]),

	status: z.enum([
		"draft",
		"active",
		"archived",
		"published",
	]).default("draft"),
});


export const collections = {


	projects: defineCollection({

		loader: glob({
			base: "./src/content/projects",
			pattern: "**/*.(md|mdx)",
		}),

		schema: commonSchema.extend({

			stack: z.array(z.string()).default([]),

		}),
	}),



	writing: defineCollection({

		loader: glob({
			base: "./src/content/writing",
			pattern: "**/*.(md|mdx)",
		}),

		schema: commonSchema,

	}),



	notes: defineCollection({

		loader: glob({
			base: "./src/content/notes",
			pattern: "**/*.(md|mdx)",
		}),

		schema: commonSchema.extend({

			stage: z.enum([
				"seedling",
				"budding",
				"evergreen",
			]).default("seedling"),

		}),
	}),



	experiments: defineCollection({

		loader: glob({
			base: "./src/content/experiments",
			pattern: "**/*.(md|mdx)",
		}),

		schema: commonSchema,

	}),



	timeline: defineCollection({

		loader: glob({
			base: "./src/content/timeline",
			pattern: "**/*.(md|mdx)",
		}),

		schema: commonSchema,

	}),


	changelog: defineCollection({
		loader: glob({
			base: "./src/content/changelog",
			pattern: "**/*.(md|mdx)",
		}),
		schema: commonSchema,
	}),

};
