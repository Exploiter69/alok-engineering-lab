/**
 * Machine-readable metadata for the repository content contract.
 *
 * The Zod schemas in src/content.config.ts remain the validation source of truth.
 * This typed descriptor is intentionally consumed by tooling (including the admin)
 * so form generation does not invent a second content model.
 */
export type FieldKind =
  | "text"
  | "textarea"
  | "date"
  | "enum"
  | "string-array"
  | "url"
  | "lifecycle-history";

export interface FieldMetadata {
  kind: FieldKind;
  required?: boolean;
  default?: string | string[];
  options?: readonly string[];
  description?: string;
}

export interface CollectionMetadata {
  label: string;
  path: string;
  fields: Record<string, FieldMetadata>;
}

const commonFields: Record<string, FieldMetadata> = {
  title: { kind: "text", required: true, description: "Public record title." },
  description: { kind: "textarea", required: true, description: "Short archive/search description." },
  date: { kind: "date", required: true, description: "Repository-backed publication or record date." },
  tags: { kind: "string-array", default: [], description: "Discovery and topic tags." },
  related: { kind: "string-array", default: [], description: "Repository content references such as projects:astra." },
  status: {
    kind: "enum",
    options: ["draft", "active", "archived", "published"],
    default: "draft",
    description: "Publication/archive state.",
  },
};

const withCommon = (fields: Record<string, FieldMetadata>) => ({
  ...commonFields,
  ...fields,
});

export const CONTENT_SCHEMA_METADATA = {
  projects: {
    label: "Projects",
    path: "src/content/projects",
    fields: withCommon({
      stack: { kind: "string-array", default: [], description: "Technologies used by the project." },
      repository: { kind: "url", description: "Verified public source repository." },
      objective: { kind: "textarea", description: "Engineering objective." },
      lifecycle: {
        kind: "enum",
        options: ["exploring", "building", "maintaining", "archived"],
        default: "exploring",
        description: "Current engineering lifecycle state.",
      },
      lifecycleSince: { kind: "date", description: "Date the current lifecycle state began." },
      lifecycleHistory: { kind: "lifecycle-history", default: [], description: "Chronological lifecycle record; never silently overwrite history." },
      architectureSummary: { kind: "textarea", description: "Repository-backed architecture summary." },
      decisions: { kind: "string-array", default: [], description: "Important engineering decisions." },
      lessons: { kind: "string-array", default: [], description: "Lessons retained from the project." },
      currentFocus: { kind: "textarea", description: "Current documented engineering focus." },
      knownProblems: { kind: "string-array", default: [], description: "Known problems or constraints." },
      futureWork: { kind: "string-array", default: [], description: "Documented future work." },
    }),
  },
  writing: {
    label: "Writing",
    path: "src/content/writing",
    fields: withCommon({
      format: { kind: "enum", options: ["essay", "case-study", "guide", "postmortem", "reference"], default: "essay" },
      audience: { kind: "text", description: "Intended reader." },
    }),
  },
  notes: {
    label: "Notes",
    path: "src/content/notes",
    fields: withCommon({
      stage: { kind: "enum", options: ["seedling", "budding", "evergreen"], default: "seedling" },
    }),
  },
  experiments: {
    label: "Experiments",
    path: "src/content/experiments",
    fields: withCommon({}),
  },
  evidence: {
    label: "Evidence",
    path: "src/content/evidence",
    fields: withCommon({
      kind: { kind: "enum", options: ["benchmark", "failure", "verification", "observation"], required: true },
      outcome: { kind: "enum", options: ["confirmed", "failed", "inconclusive", "informational"], required: true },
      method: { kind: "textarea", required: true },
      result: { kind: "textarea", required: true },
      limitations: { kind: "string-array", default: [] },
    }),
  },
  timeline: {
    label: "Timeline",
    path: "src/content/timeline",
    fields: withCommon({}),
  },
  changelog: {
    label: "Changelog",
    path: "src/content/changelog",
    fields: withCommon({}),
  },
} satisfies Record<string, CollectionMetadata>;

export type CollectionName = keyof typeof CONTENT_SCHEMA_METADATA;
