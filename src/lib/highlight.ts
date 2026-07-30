
import { codeToHtml } from "shiki";
import type { Learning, LearningLanguage } from "@/types";

const EDITOR_THEME = "github-dark-default";

export type HighlightedCode = Record<LearningLanguage, string>;

export const highlightLearning = async (
  learning: Learning
): Promise<HighlightedCode> => {
  const entries = await Promise.all(
    (Object.entries(learning.code) as [LearningLanguage, string][]).map(
      async ([lang, code]) =>
        [lang, await codeToHtml(code, { lang, theme: EDITOR_THEME })] as const
    )
  );
  return Object.fromEntries(entries) as HighlightedCode;
};
