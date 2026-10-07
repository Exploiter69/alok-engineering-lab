export const COLLECTIONS = {
  projects: {
    label: "Projects",
    fields: {
      title: ["text", true], description: ["textarea", true], date: ["date", true], tags: ["string-array", false], related: ["string-array", false],
      status: ["enum", true, ["draft","active","archived","published"]], stack: ["string-array", false], repository: ["url", false],
      objective: ["textarea", false], lifecycle: ["enum", true, ["exploring","building","maintaining","archived"]], lifecycleSince: ["date", false],
      lifecycleHistory: ["lifecycle-history", false], architectureSummary: ["textarea", false], decisions: ["string-array", false],
      lessons: ["string-array", false], currentFocus: ["textarea", false], knownProblems: ["string-array", false], futureWork: ["string-array", false],
    },
  },
  writing: {
    label: "Writing",
    fields: { title:["text",true], description:["textarea",true], date:["date",true], tags:["string-array",false], related:["string-array",false], status:["enum",true,["draft","active","archived","published"]], format:["enum",true,["essay","case-study","guide","postmortem","reference"]], audience:["text",false] },
  },
  notes: {
    label: "Notes",
    fields: { title:["text",true], description:["textarea",true], date:["date",true], tags:["string-array",false], related:["string-array",false], status:["enum",true,["draft","active","archived","published"]], stage:["enum",true,["seedling","budding","evergreen"]] },
  },
  experiments: {
    label: "Experiments",
    fields: { title:["text",true], description:["textarea",true], date:["date",true], tags:["string-array",false], related:["string-array",false], status:["enum",true,["draft","active","archived","published"]] },
  },
  evidence: {
    label: "Evidence",
    fields: { title:["text",true], description:["textarea",true], date:["date",true], tags:["string-array",false], related:["string-array",false], status:["enum",true,["draft","active","archived","published"]], kind:["enum",true,["benchmark","failure","verification","observation"]], outcome:["enum",true,["confirmed","failed","inconclusive","informational"]], method:["textarea",true], result:["textarea",true], limitations:["string-array",false] },
  },
  timeline: {
    label: "Timeline",
    fields: { title:["text",true], description:["textarea",true], date:["date",true], tags:["string-array",false], related:["string-array",false], status:["enum",true,["draft","active","archived","published"]] },
  },
  changelog: {
    label: "Changelog",
    fields: { title:["text",true], description:["textarea",true], date:["date",true], tags:["string-array",false], related:["string-array",false], status:["enum",true,["draft","active","archived","published"]] },
  },
};

export function collection(name) {
  return COLLECTIONS[name] || null;
}
