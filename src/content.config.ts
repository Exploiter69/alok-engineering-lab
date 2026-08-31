import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";


const commonSchema = z.object({
	title: z.string(),
	description: z.string(),
	date: z.coerce.date(),
	tags: z.array(z.string()).default([]),

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
			pattern: "**/*.md",
		}),

		schema: commonSchema.extend({

			stack: z.array(z.string()).default([]),

		}),
	}),



	writing: defineCollection({

		loader: glob({
			base: "./src/content/writing",
			pattern: "**/*.md",
		}),

		schema: commonSchema,

	}),



	notes: defineCollection({

		loader: glob({
			base: "./src/content/notes",
			pattern: "**/*.md",
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
			pattern: "**/*.md",
		}),

		schema: commonSchema,

	}),



	timeline: defineCollection({

		loader: glob({
			base: "./src/content/timeline",
			pattern: "**/*.md",
		}),

		schema: commonSchema,

	}),


};
