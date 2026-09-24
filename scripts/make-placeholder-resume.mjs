/**
 * One-off: writes a minimal, valid PDF to public/resume.pdf so the "Download
 * resume" link on /about is not a 404 out of the box.
 *
 * This is a PLACEHOLDER. Replace public/resume.pdf with your real CV before
 * going live - the page links to it by path, so swapping the file is enough.
 *
 * Details mirror lib/site.ts. They are duplicated rather than imported because
 * lib/site.ts is TypeScript and this runs as plain Node.
 */
import { writeFileSync, statSync } from "node:fs";

const LINES = [
  { size: 22, y: 720, text: "Manish Kumar" },
  { size: 13, y: 696, text: "Senior Lead Technical Specialist @ Kyndryl" },
  { size: 10, y: 676, text: "Bengaluru, Karnataka, India" },
  { size: 10, y: 658, text: "manishsharan@yopmail.com  |  linkedin.com/in/dev-manish" },
  { size: 11, y: 618, text: "PLACEHOLDER - replace public/resume.pdf with your real CV." },
];

/**
 * PDF literal strings treat ( and ) as delimiters and \\ as an escape, so both
 * must be escaped or the file becomes unparseable.
 */
function escapePdfText(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

const stream = LINES.map(
  (line) =>
    `BT /F1 ${line.size} Tf 72 ${line.y} Td (${escapePdfText(line.text)}) Tj ET\n`,
).join("");

const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
  `<< /Length ${stream.length} >>\nstream\n${stream}endstream`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
];

let pdf = "%PDF-1.4\n";
const offsets = [];

objects.forEach((body, index) => {
  offsets.push(pdf.length);
  pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefStart = pdf.length;
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const offset of offsets) {
  pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

const target = new URL("../public/resume.pdf", import.meta.url);
writeFileSync(target, pdf, "latin1");
console.log(`wrote ${target.pathname} (${statSync(target).size} bytes)`);
