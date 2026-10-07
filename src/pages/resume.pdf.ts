export const prerender = true;

const lines = [
  ["Alok Thakur", 18, true],
  ["Engineering systems | Automation | AI | Linux | Developer tooling", 9, false],
  ["alokthakur.me | github.com/Exploiter69", 9, false],
  ["", 9, false],
  ["PROFILE", 12, true],
  ["I build reliable automation and AI systems and document the engineering decisions,", 9, false],
  ["failures, experiments and evidence behind them.", 9, false],
  ["", 9, false],
  ["SELECTED ENGINEERING WORK", 12, true],
  ["ASTRA Engine / ASTRA Userbot", 10, true],
  ["Autonomous engineering and Telegram automation work focused on modular Python systems,", 9, false],
  ["async execution, SQLite-backed state and AI-assisted workflows.", 9, false],
  ["VGU-Signal", 10, true],
  ["University information acquisition and verification system for fragmented notices and", 9, false],
  ["academic information, with trust and evidence as first-class concerns.", 9, false],
  ["Gemini Agent Bridge", 10, true],
  ["Remote AI augmentation and tool-oriented automation engineering.", 9, false],
  ["TelDrive Lab", 10, true],
  ["Repository-backed storage and automation experiments using Telegram storage, rclone and local workflows.", 9, false],
  ["Vajra", 10, true],
  ["Engineering system work exploring automation, reliability and durable project workflows.", 9, false],
  ["", 9, false],
  ["TECHNICAL FOCUS", 12, true],
  ["Python, asyncio, TypeScript, Astro, Tailwind CSS, MDX, Git/GitHub, Linux,", 9, false],
  ["automation, AI agents, static-site architecture, verification and reliability engineering.", 9, false],
  ["", 9, false],
  ["ENGINEERING APPROACH", 12, true],
  ["Inspect before modifying. Prefer small reviewable changes. Keep architecture understandable.", 9, false],
  ["Treat evidence and failure as first-class engineering information. Use repository state", 9, false],
  ["and automated validation as release gates.", 9, false],
  ["", 9, false],
  ["PUBLIC WORK", 12, true],
  ["Website: https://www.alokthakur.me", 9, false],
  ["GitHub: https://github.com/Exploiter69", 9, false],
  ["Engineering Lab: projects, writing, notes, experiments, evidence and journey", 9, false],
];

const esc = (value: string) => value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
const content = ["BT"];
let y = 790;
for (const [text, size, bold] of lines) {
  const value = String(text);
  if (!value) { y -= 9; continue; }
  content.push("/" + (bold ? "F2" : "F1") + " " + size + " Tf 48 " + y + " Td (" + esc(value) + ") Tj");
  y -= bold ? 18 : 13;
}
content.push("ET");
const stream = content.join("\n");
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  "<< /Length " + stream.length + " >>\nstream\n" + stream + "\nendstream",
];
let pdf = "%PDF-1.4\n";
const offsets = [0];
for (let i = 0; i < objects.length; i++) {
  offsets.push(pdf.length);
  pdf += (i + 1) + " 0 obj\n" + objects[i] + "\nendobj\n";
}
const xref = pdf.length;
pdf += "xref\n0 " + (objects.length + 1) + "\n0000000000 65535 f \n";
for (let i = 1; i <= objects.length; i++) pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
pdf += "trailer\n<< /Size " + (objects.length + 1) + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF";
const bytes = Uint8Array.from(pdf, char => char.charCodeAt(0));
return new Response(bytes, { headers: { "Content-Type": "application/pdf", "Content-Disposition": "inline; filename=\"alok-thakur-resume.pdf\"\" } });
