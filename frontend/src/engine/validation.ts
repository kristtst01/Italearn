import leven from 'leven';

export interface ValidationResult {
  /** Whether the answer counts as correct */
  correct: boolean;
  /** True when the answer is close but not accepted (typo) */
  almostCorrect: boolean;
  /** Optional feedback message to show the user */
  feedback?: string;
  /** The user's input after whitespace normalization */
  normalizedInput: string;
}

export interface ValidateOptions {
  /** A missing or wrong accent makes the answer wrong (for exercises that test the accent) */
  strictAccents?: boolean;
}

/**
 * Words with two accepted spellings (Treccani lists both), mapped to one form so
 * either spelling matches. The one-word form is the more common.
 */
const SPELLING_VARIANTS: [RegExp, string][] = [
  [/\bbuon giorno\b/gi, 'buongiorno'],
  [/\bbuona sera\b/gi, 'buonasera'],
  [/\bbuona notte\b/gi, 'buonanotte'],
];

/**
 * Normalize for comparison: punctuation is ignored everywhere (a missing comma isn't a mistake,
 * and speech transcripts punctuate unpredictably), apostrophes are kept since they're part of
 * words (c'è, dov'è), whitespace is collapsed and spelling variants unified.
 */
function normalize(s: string): string {
  let out = s
    .replace(/’/g, "'")
    .replace(/[.,!?;:¡¿"“”«»…()]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
  for (const [pattern, canonical] of SPELLING_VARIANTS) out = out.replace(pattern, canonical);
  return out;
}

/** Strip diacritics using Unicode NFD decomposition. */
function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Check if two strings match ignoring case and accents. */
function matchIgnoringAccents(a: string, b: string): boolean {
  const collator = new Intl.Collator('it', { sensitivity: 'base' });
  return collator.compare(a, b) === 0;
}

/** Check if `a` matches `b` case-insensitively but has missing/wrong accents. */
function hasMissingAccents(input: string, expected: string): boolean {
  // They match ignoring accents, but differ when accents matter
  const collator = new Intl.Collator('it', { sensitivity: 'accent' });
  return collator.compare(input, expected) !== 0;
}

/**
 * Find which accented word the user missed and build feedback.
 * e.g., "perche" vs "perché" → "Remember: it's perché with an accent!"
 */
function buildAccentFeedback(
  input: string,
  expected: string,
): string | undefined {
  const inputWords = input.toLowerCase().split(' ');
  const expectedWords = expected.toLowerCase().split(' ');

  for (let i = 0; i < expectedWords.length; i++) {
    const ew = expectedWords[i];
    const iw = inputWords[i];
    if (iw && stripAccents(iw) === stripAccents(ew) && iw !== ew) {
      return `Remember: it's "${ew}" with an accent!`;
    }
  }
  return `Watch your accents! Correct: "${expected}"`;
}

/**
 * Compute the maximum allowed Levenshtein distance based on word length.
 * Short words (≤4 chars): no typo tolerance (too easy to confuse different words).
 * Medium words (5-6 chars): 1 edit allowed.
 * Long words (>6 chars): 2 edits allowed.
 */
function maxAllowedDistance(length: number): number {
  if (length <= 4) return 0;
  if (length <= 6) return 1;
  return 2;
}

/**
 * If the two answers are the same except for one misspelled word, returns that word as the
 * expected answer spells it. Both strings are normalized and lower-case; accents are ignored
 * when comparing but kept in the word returned.
 */
function singleMisspelledWord(input: string, expected: string): string | null {
  const inputWords = stripAccents(input).split(' ');
  const expectedWords = expected.split(' ');
  if (inputWords.length !== expectedWords.length) return null;

  const plain = expectedWords.map(stripAccents);
  const differing = plain.flatMap((w, i) => (w === inputWords[i] ? [] : [i]));
  if (differing.length !== 1) return null;

  const i = differing[0];
  const allowed = maxAllowedDistance(plain[i].length);
  return allowed > 0 && leven(inputWords[i], plain[i]) <= allowed ? expectedWords[i] : null;
}

/**
 * Validate a user's typed answer against the expected correct answer.
 *
 * Validation tiers:
 * 1. Exact match (case-insensitive) → correct
 * 2. Match ignoring accents → correct + accent reminder
 * 3. One word slightly misspelled → incorrect + "almost correct" hint
 * 4. Otherwise → incorrect
 */
export function validateAnswer(
  userInput: string,
  correctAnswer: string,
  { strictAccents = false }: ValidateOptions = {},
): ValidationResult {
  const normalizedInput = normalize(userInput);
  const normalizedExpected = normalize(correctAnswer);

  const inputLower = normalizedInput.toLowerCase();
  const expectedLower = normalizedExpected.toLowerCase();

  // Tier 1: Exact match (case-insensitive)
  if (inputLower === expectedLower) {
    return { correct: true, almostCorrect: false, normalizedInput };
  }

  // Tier 2: Match ignoring accents → correct but remind about accents
  // (wrong when the accent is what's being tested)
  if (matchIgnoringAccents(inputLower, expectedLower)) {
    if (hasMissingAccents(inputLower, expectedLower)) {
      if (strictAccents) {
        return {
          correct: false,
          almostCorrect: true,
          feedback: buildAccentFeedback(normalizedInput, normalizedExpected),
          normalizedInput,
        };
      }
      return {
        correct: true,
        almostCorrect: false,
        feedback: buildAccentFeedback(normalizedInput, normalizedExpected),
        normalizedInput,
      };
    }
    // Collator says equal but it's not an accent issue — treat as correct
    return { correct: true, almostCorrect: false, normalizedInput };
  }

  // Tier 3: Typo tolerance, word by word. Only one word may differ, and only by a small
  // misspelling for its length. Short words get none, so real differences (si/ti, sei/sai,
  // sono/sto) aren't mistaken for typos and go on to the LLM check instead.
  const typoWord = singleMisspelledWord(inputLower, expectedLower);
  if (typoWord) {
    return {
      correct: false,
      almostCorrect: true,
      feedback: `Almost: check the spelling of "${typoWord}".`,
      normalizedInput,
    };
  }

  // Tier 4: Incorrect
  return { correct: false, almostCorrect: false, normalizedInput };
}

/**
 * Validate against multiple accepted answers, returning the best result.
 * If any answer is correct, returns that. Otherwise returns the best near-miss.
 */
export function validateAnswerMulti(
  userInput: string,
  correctAnswers: string | string[],
  options: ValidateOptions = {},
): ValidationResult {
  const answers = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];
  let bestResult: ValidationResult | null = null;

  for (const answer of answers) {
    const result = validateAnswer(userInput, answer, options);
    if (result.correct) return result;
    if (!bestResult || result.almostCorrect) bestResult = result;
  }

  return bestResult!;
}
