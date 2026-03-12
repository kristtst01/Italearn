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

/** Normalize whitespace and strip trailing punctuation (?.!). */
function normalize(s: string): string {
  return s.trim().replace(/\s+/g, ' ').replace(/[?!.]+$/, '');
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
 * Validate a user's typed answer against the expected correct answer.
 *
 * Validation tiers:
 * 1. Exact match (case-insensitive) → correct
 * 2. Match ignoring accents → correct + accent reminder
 * 3. Within Levenshtein threshold → incorrect + "almost correct" hint
 * 4. Otherwise → incorrect
 */
export function validateAnswer(
  userInput: string,
  correctAnswer: string,
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
  if (matchIgnoringAccents(inputLower, expectedLower)) {
    if (hasMissingAccents(inputLower, expectedLower)) {
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

  // Tier 3: Typo tolerance via Levenshtein distance (on accent-stripped strings)
  const strippedInput = stripAccents(inputLower);
  const strippedExpected = stripAccents(expectedLower);
  const maxDist = maxAllowedDistance(strippedExpected.length);

  if (maxDist > 0) {
    const distance = leven(strippedInput, strippedExpected);
    if (distance <= maxDist) {
      return {
        correct: false,
        almostCorrect: true,
        feedback: `You typed "${normalizedInput}" — close! The correct answer is "${normalizedExpected}".`,
        normalizedInput,
      };
    }
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
): ValidationResult {
  const answers = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];
  let bestResult: ValidationResult | null = null;

  for (const answer of answers) {
    const result = validateAnswer(userInput, answer);
    if (result.correct) return result;
    if (!bestResult || result.almostCorrect) bestResult = result;
  }

  return bestResult!;
}
