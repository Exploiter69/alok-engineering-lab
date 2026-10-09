export const SEARCH_TYPES = ["Project", "Writing", "Note", "Experiment", "Evidence", "Page"] as const;

export type SearchType = (typeof SEARCH_TYPES)[number];

export interface SearchRecord {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: SearchType;
  href: string;
}

export interface SearchSourceEntry {
  id: string;
  data: {
    title: string;
    description: string;
    tags: string[];
  };
}

export function toSearchRecord(
  entry: SearchSourceEntry,
  type: SearchType,
  href: string,
): SearchRecord {
  return {
    id: `${type.toLowerCase()}:${entry.id}`,
    title: entry.data.title,
    description: entry.data.description,
    tags: entry.data.tags,
    type,
    href,
  };
}

const normalize = (value: string) =>
  value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function subsequenceScore(query: string, value: string): number {
  if (!query || !value) return 0;

  let cursor = 0;
  let consecutive = 0;

  for (const character of query) {
    const next = value.indexOf(character, cursor);
    if (next === -1) return 0;
    if (next === cursor) consecutive += 1;
    cursor = next + 1;
  }

  return 40 + consecutive * 6 - Math.max(0, value.length - query.length) * 0.02;
}

export function scoreSearchRecord(query: string, record: SearchRecord): number {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;

  const title = normalize(record.title);
  const description = normalize(record.description);
  const type = normalize(record.type);
  const tags = record.tags.map(normalize);
  let score = 0;

  if (title === normalizedQuery) score = Math.max(score, 1000);
  else if (title.startsWith(normalizedQuery)) score = Math.max(score, 850);
  else if (title.includes(normalizedQuery)) score = Math.max(score, 720);
  else score = Math.max(score, subsequenceScore(normalizedQuery, title) * 10);

  if (tags.some(tag => tag === normalizedQuery)) score = Math.max(score, 600);
  else if (tags.some(tag => tag.startsWith(normalizedQuery))) score = Math.max(score, 520);
  else if (tags.some(tag => tag.includes(normalizedQuery))) score = Math.max(score, 440);

  if (description.startsWith(normalizedQuery)) score = Math.max(score, 360);
  else if (description.includes(normalizedQuery)) score = Math.max(score, 300);
  else score = Math.max(score, subsequenceScore(normalizedQuery, description) * 5);

  if (type === normalizedQuery) score = Math.max(score, 260);
  else if (type.startsWith(normalizedQuery)) score = Math.max(score, 220);

  return score;
}

export function searchRecords(query: string, records: SearchRecord[]): SearchRecord[] {
  if (!normalize(query)) return records;

  return records
    .map((record, index) => ({ record, score: scoreSearchRecord(query, record), index }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(item => item.record);
}
