export const queryTokens = (query: string): string[] =>
  query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

export const wordsOf = (value: string): string[] =>
  value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

export const fieldScore = (
  token: string,
  words: string[],
  weight: number
): number => {
  let best = 0;
  for (const word of words) {
    if (word === token) best = Math.max(best, weight * 3);
    else if (word.startsWith(token)) best = Math.max(best, weight * 2);
    else if (word.includes(token)) best = Math.max(best, weight);
  }
  return best;
};
