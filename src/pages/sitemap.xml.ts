import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const staticRoutes = [
  "/",
  "/about/",
  "/changelog/",
  "/docs/",
  "/experiments/",
  "/garden/",
  "/notes/",
  "/projects/",
  "/timeline/",
  "/writing/",
  "/evidence/",
];

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://www.alokthakur.me");
  const visible = (entry: { data: { status: string } }) => entry.data.status !== "draft";
  const entries = [
    ...staticRoutes,
    ...(await getCollection("projects")).filter(visible).map((entry) => "/projects/" + entry.id + "/"),
    ...(await getCollection("writing")).filter(visible).map((entry) => "/writing/" + entry.id + "/"),
    ...(await getCollection("notes")).filter(visible).map((entry) => "/notes/" + entry.id + "/"),
    ...(await getCollection("experiments")).filter(visible).map((entry) => "/experiments/" + entry.id + "/"),
    ...(await getCollection("timeline")).filter(visible).map((entry) => "/timeline/" + entry.id + "/"),
    ...(await getCollection("changelog")).filter(visible).map((entry) => "/changelog/" + entry.id + "/"),
    ...(await getCollection("evidence")).filter(visible).map((entry) => "/evidence/" + entry.id + "/"),
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
