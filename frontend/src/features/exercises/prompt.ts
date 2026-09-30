/**
 * Turns common prompt patterns into an instruction + hero, so the word being tested
 * can be shown large. Returns null for prompts that should be shown as a sentence.
 */
const PATTERNS: { re: RegExp; instruction: string }[] = [
  { re: /^What does ['‘"“](.+?)['’"”] mean\??$/i, instruction: 'What does this mean?' },
  { re: /^How do you say ['‘"“](.+?)['’"”](?: in Italian)?\??$/i, instruction: 'How do you say this in Italian?' },
];

export function splitPrompt(text: string): { instruction: string; hero: string } | null {
  for (const { re, instruction } of PATTERNS) {
    const m = text.trim().match(re);
    if (m) return { instruction, hero: m[1] };
  }
  return null;
}
