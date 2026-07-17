// Build-time syntax highlighting — runs in server components during
// `next build`, so shiki never ships to the client.

import { codeToHtml } from "shiki";
import type { Learning, LearningLanguage } from "./data.types";

const EDITOR_THEME = "github-dark-default";

export type HighlightedCode = Record<LearningLanguage, string>;

export async function highlightLearning(
  learning: Learning
): Promise<HighlightedCode> {
  const entries = await Promise.all(
    (Object.entries(learning.code) as [LearningLanguage, string][]).map(
      async ([lang, code]) =>
        [lang, await codeToHtml(code, { lang, theme: EDITOR_THEME })] as const
    )
  );
  return Object.fromEntries(entries) as HighlightedCode;
}
