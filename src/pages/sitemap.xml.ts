import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { slugifyTopic } from "../lib/topics";

const staticRoutes = [
  "/",
  "/about/",
  "/changelog/",
  "/docs/",
  "/docs/content-workflow/",
  "/experiments/",
  "/garden/",
  "/notes/",
  "/projects/",
  "/timeline/",
  "/writing/",
  "/evidence/",
  "/explore/",
  "/connections/",
  "/contact/",
  "/resume.pdf",
];

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://www.alokthakur.me");
  const entries = [
    ...staticRoutes,
    ...(await getCollection("projects")).filter((entry) => entry.data.status !== "draft").map((entry) => "/projects/" + entry.id + "/"),
    ...(await getCollection("writing")).filter((entry) => entry.data.status !== "draft").map((entry) => "/writing/" + entry.id + "/"),
    ...(await getCollection("notes")).filter((entry) => entry.data.status !== "draft").map((entry) => "/notes/" + entry.id + "/"),
    ...(await getCollection("experiments")).filter((entry) => entry.data.status !== "draft").map((entry) => "/experiments/" + entry.id + "/"),
    ...(await getCollection("timeline")).filter((entry) => entry.data.status !== "draft").map((entry) => "/timeline/" + entry.id + "/"),
    ...(await getCollection("changelog")).filter((entry) => entry.data.status !== "draft").map((entry) => "/changelog/" + entry.id + "/"),
    ...(await getCollection("evidence")).filter((entry) => entry.data.status !== "draft").map((entry) => "/evidence/" + entry.id + "/"),
    ...[...new Set([
      ...(await getCollection("notes")).filter((entry) => entry.data.status !== "draft").flatMap((entry) => entry.data.tags),
      ...(await getCollection("writing")).filter((entry) => entry.data.status !== "draft").flatMap((entry) => entry.data.tags),
      ...(await getCollection("experiments")).filter((entry) => entry.data.status !== "draft").flatMap((entry) => entry.data.tags),
      ...(await getCollection("evidence")).filter((entry) => entry.data.status !== "draft").flatMap((entry) => entry.data.tags),
    ])].map((topic) => "/garden/topics/" + slugifyTopic(topic) + "/"),
  ];

  const urls = [...new Set(entries)].map((route) => new URL(route, base).href);
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => "  <url><loc>" + url + "</loc></url>"),
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
