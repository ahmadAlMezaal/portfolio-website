import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const EM_DASH = String.fromCharCode(0x2014);
const EN_DASH = String.fromCharCode(0x2013);

const entity = (name: string): string => `&${name};`;

const OFFENDERS = [
  { pattern: EM_DASH, label: "em dash" },
  { pattern: EN_DASH, label: "en dash" },
  { pattern: entity("mdash"), label: "em dash entity" },
  { pattern: entity("ndash"), label: "en dash entity" },
];

const CHECKED = new Set([
  "md",
  "ts",
  "tsx",
  "js",
  "mjs",
  "css",
  "json",
  "yml",
  "yaml",
  "html",
  "txt",
]);

const SKIPPED = new Set(["pnpm-lock.yaml"]);

const trackedFiles = (): string[] =>
  execFileSync("git", ["ls-files"], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean)
    .filter((file) => {
      const name = file.slice(file.lastIndexOf("/") + 1);
      if (SKIPPED.has(name)) return false;
      const dot = file.lastIndexOf(".");
      return dot !== -1 && CHECKED.has(file.slice(dot + 1));
    });

type Problem = { file: string; line: number; column: number; label: string; text: string };

const scan = (file: string): Problem[] => {
  const problems: Problem[] = [];
  const lines = readFileSync(file, "utf8").split("\n");

  lines.forEach((text, index) => {
    for (const { pattern, label } of OFFENDERS) {
      let from = 0;
      for (;;) {
        const at = text.indexOf(pattern, from);
        if (at === -1) break;
        problems.push({ file, line: index + 1, column: at + 1, label, text });
        from = at + pattern.length;
      }
    }
  });

  return problems;
};

const excerpt = (text: string, column: number): { line: string; caret: string } => {
  const start = Math.max(0, column - 40);
  const line = text.slice(start, start + 96).trimEnd();
  const lead = start > 0 ? "…" : "";
  return {
    line: lead + line,
    caret: " ".repeat(lead.length + (column - 1 - start)) + "^",
  };
};

const problems = trackedFiles().flatMap(scan);

if (problems.length === 0) {
  console.log("check-prose: no em dashes, en dashes or dash entities in tracked files");
  process.exit(0);
}

const plural = problems.length === 1 ? "problem" : "problems";

console.error(`check-prose: ${problems.length} ${plural}\n`);

for (const problem of problems) {
  const { line, caret } = excerpt(problem.text, problem.column);
  console.error(`  ${problem.file}:${problem.line}:${problem.column}`);
  console.error(`    ${line}`);
  console.error(`    ${caret} ${problem.label}`);
  console.error("");
}

console.error("Reword the sentence. Swapping the character for a hyphen is not a fix.");
process.exit(1);
