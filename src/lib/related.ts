import { getCollection } from "astro:content";

const collections = [
  "projects",
  "writing",
  "notes",
  "experiments",
  "timeline",
  "changelog",
] as const;

const routes = {
  projects: "/projects",
  writing: "/writing",
  notes: "/notes",
  experiments: "/experiments",
  timeline: "/timeline",
  changelog: "/changelog",
} as const;

export async function resolveRelated(related: string[] = []) {
  const results = [];

  for (const reference of related) {
    const separator = reference.indexOf(":");

    if (separator === -1) continue;

    const collection = reference.slice(0, separator);
    const slug = reference.slice(separator + 1);

    if (!collections.includes(collection as typeof collections[number])) {
      continue;
    }

    const entries = await getCollection(collection as typeof collections[number]);

    const entry = entries.find(
      item => item.id === slug && item.data.status !== "draft"
    );

    if (!entry) continue;

    results.push({
      title: entry.data.title,
      description: entry.data.description,
      href: `${routes[collection as keyof typeof routes]}/${entry.id}`,
      type: collection.charAt(0).toUpperCase() + collection.slice(1),
    });
  }

  return results;
}
