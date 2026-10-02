/// <reference types="node" />
/**
 * Content check: run with `npm run check:content` (add `--all` to include chapters not marked ready).
 *
 * 1. Taught before: every Italian word a learner sees must have been introduced first, either on a
 *    new-words list (this lesson or earlier) or by a grammar unit earlier in the course (its forms,
 *    and the Italian it shows with translations). Fixed phrases used on purpose before their grammar
 *    are listed in content-allowlist.json.
 * 2. Structure: lessons and curriculum agree, ids are unique, exercises are well formed.
 * 3. Answers: accepted answers pass the app's own validator; multiple-choice options make sense.
 * 4. Style: no em-dashes, no capitals for emphasis.
 * 5. Coverage (info): words introduced but never practised; Profilo A1 words taught so far.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { curriculum } from '../src/data/curriculum';
import { GRAMMAR_PLAN } from '../src/data/grammarPlan';
import { COURSE } from '../src/data/course';
import { validateAnswerMulti } from '../src/engine/validation';
import type { Exercise, Lesson, LessonMeta, Unit } from '../src/types';
import type { GrammarPractice } from '../src/types/grammar';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '../src/data');
const ROOT = join(HERE, '../..');
const ALL = process.argv.includes('--all');

// ── Report ────────────────────────────────────────────

type Level = 'error' | 'warning' | 'info';
const report = new Map<string, { level: Level; msg: string }[]>();
function flag(where: string, level: Level, msg: string) {
  if (!report.has(where)) report.set(where, []);
  report.get(where)!.push({ level, msg });
}

// ── Words ─────────────────────────────────────────────

/** Italian words in a text: lower-case, apostrophes kept (dov'è, un'idea), digits and blanks dropped. */
function tokens(text: string): string[] {
  return text
    .replace(/’/g, "'")
    .replace(/___/g, ' ')
    .split(/[^\p{L}']+/u)
    .map((t) => t.replace(/^'+|'+$/g, '').toLowerCase())
    .filter((t) => t.length > 0);
}

/** Present-tense forms of a regular verb (with -isc- forms too, since the infinitive doesn't show it). */
function conjugate(inf: string): string[] {
  const stem = inf.slice(0, -3);
  const ending = inf.slice(-3);
  if (ending === 'are') {
    const hard = /[cg]$/.test(stem) ? stem + 'h' : stem; // cercare → cerchi
    const soft = stem.endsWith('i') ? stem.slice(0, -1) : stem; // studiare → studi
    const i = stem.endsWith('i') ? soft : hard;
    return [stem + 'o', i + 'i', stem + 'a', i + 'iamo', stem + 'ate', stem + 'ano'];
  }
  const shared = [stem + 'o', stem + 'i', stem + 'e', stem + 'iamo', stem + 'ono'];
  if (ending === 'ere') return [...shared, stem + 'ete'];
  if (ending === 'ire') return [...shared, stem + 'ite', stem + 'isco', stem + 'isci', stem + 'isce', stem + 'iscono'];
  return [];
}

/** Simple inflections, so tedesco also allows tedesca/tedeschi/tedesche, and verbs their present tense. */
function forms(word: string): string[] {
  const w = word.toLowerCase();
  const out = [w];
  if (w.length > 4 && /(are|ere|ire)$/.test(w)) out.push(...conjugate(w));
  const stem = (n: number) => w.slice(0, w.length - n);
  if (w.endsWith('co')) out.push(stem(1) + 'a', stem(1) + 'hi', stem(1) + 'he', stem(1) + 'i');
  else if (w.endsWith('go')) out.push(stem(1) + 'a', stem(1) + 'hi', stem(1) + 'he');
  else if (w.endsWith('io')) out.push(stem(1), stem(1) + 'a', stem(1) + 'e');
  else if (w.endsWith('o')) out.push(stem(1) + 'a', stem(1) + 'i', stem(1) + 'e');
  else if (w.endsWith('ca')) out.push(stem(1) + 'he');
  else if (w.endsWith('a')) out.push(stem(1) + 'e', stem(1) + 'i');
  else if (w.endsWith('e')) out.push(stem(1) + 'i', stem(1) + 'a');
  else if (w.endsWith('i')) out.push(stem(1) + 'o', stem(1) + 'e', stem(1) + 'a');
  return out;
}

/** Italian numbers 0–100 as words, with the shortened forms used before anni. */
function numberWords(): string[] {
  const units = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove'];
  const teens = ['dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];
  const tens = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta'];
  const out = [...units, ...teens, 'cento', 'un', 'una'];
  for (let t = 2; t < 10; t++) {
    out.push(tens[t]);
    for (let u = 1; u < 10; u++) {
      const ten = u === 1 || u === 8 ? tens[t].slice(0, -1) : tens[t];
      const num = ten + (u === 3 ? 'tré' : units[u]);
      out.push(num);
      if (u === 1) out.push(num.slice(0, -1)); // ventun (anni)
    }
    out.push(tens[t].slice(0, -1) + "'anni"); // vent'anni
  }
  return out;
}

/**
 * Forms each grammar unit teaches outright (beyond the Italian it shows with translations,
 * which is read from its Markdown).
 */
const GRAMMAR_FORMS: Record<string, string[]> = {
  'a1-first-phrases': [],
  'a1-essere': ['io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro', 'sono', 'sei', 'è', 'siamo', 'siete', 'e', 'ed', 'non', 'di', "d'", 'a', 'anche', "anch'io", "dov'è", "com'è", 'chi', 'dove', 'come', 'questo', 'questa'],
  'a1-numbers': numberWords(),
  // un/una appear here as part of fixed phrases (ho un cane); the article system is its own unit
  'a1-nouns-articles': ['il', 'lo', 'la', "l'", 'i', 'gli', 'le', 'un', 'uno', 'una', "un'", "c'è", 'ci', 'signor'],
  'a1-avere': ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno', 'anni', 'un', 'una', "un'", 'fa', 'molto', 'molta'],
};

// ── Data ──────────────────────────────────────────────

const readJson = <T,>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T;
const units = curriculum.sections.flatMap((s) => s.units);
const unitById = new Map(units.map((u) => [u.id, u]));
const lessonFile = (id: string) => join(SRC, 'units', id.replace(/-lesson-\d+$/, ''), `${id}.json`);
const loadLesson = (id: string) => readJson<Lesson>(lessonFile(id));

interface AllowEntry { phrase: string; reason: string }
const allowlist = readJson<AllowEntry[]>(join(HERE, 'content-allowlist.json'));

/**
 * Names: words written with a capital in the middle of a sentence somewhere in the content, or
 * anywhere but the first word of an English prompt or hint ("Complete: Sophie is French.").
 */
const names = new Set<string>();
function collectNames(text: string) {
  for (const m of text.matchAll(/(?<![.!?:]\s|^)\b(\p{Lu}[\p{L}']+)/gu)) names.add(m[1].toLowerCase());
}
function collectNamesFromEnglish(text: string) {
  for (const m of text.matchAll(/(?<!^)\b(\p{Lu}[\p{L}]+)/gu)) names.add(m[1].toLowerCase());
}
function collectNamesFromExercise(e: Exercise) {
  for (const t of [e.sentence_context, ...answers(e), ...e.distractors, ...(e.dialogue ?? []).map((l) => l.text ?? '')]) collectNames(t);
  for (const t of [e.prompt.text ?? '', ...e.hints]) collectNamesFromEnglish(t);
}

/** The Italian a grammar reading shows: example lines, and words in bold or italics. */
function readingItalian(md: string): string[] {
  const out: string[] = [];
  const lines = md.split('\n');
  for (let i = 0; i < lines.length; i++) {
    // An example block: the first > line is Italian, the second English
    if (lines[i].startsWith('> ') && !lines[i - 1]?.startsWith('> ')) out.push(lines[i].slice(2));
  }
  // Bold and italics, per line so a stray asterisk can't shift the pairing
  for (const line of lines) for (const m of line.matchAll(/\*\*([^*]+)\*\*|\*([^*]+)\*/g)) out.push(m[1] ?? m[2]);
  return out;
}

// ── Checks on one exercise ────────────────────────────

/** Little words that phrases share without being duplicates (sto bene and bene is a duplicate; di dove and di is not). */
const LITTLE_WORDS = new Set(['e', 'di', 'a', 'non', 'mi', 'ti', 'si', 'un', 'una', "un'", 'per', 'come', 'che', 'il', 'la']);
const EM_DASH = /—/;
const CAPS = /\b[A-Z]{3,}\b/;
const ACRONYMS = new Set(['AM', 'PM', 'OK', 'USA', 'UK']);
const EN_WORDS = new Set(['the', 'you', 'your', 'i', "i'm", 'it', "it's", 'is', 'are', 'am', 'was', 'have', 'has', 'do', 'does', 'what', 'how',
  'my', 'he', 'she', 'they', 'we', 'of', 'to', 'for', 'with', 'not', 'true', 'false', 'good', 'happy', 'yes', 'in', 'on', 'at', 'his', 'her',
  'who', 'because', 'can', 'and', 'or', 'ask', 'say', 'tomorrow', 'today', 'old', 'years', "he's", "she's", "don't", 'no']);
/**
 * Answers and options can be English (meaning and comprehension questions). Treat a string as
 * Italian when it has no clearly English word and at least half its words are known Italian or names.
 */
const looksEnglish = (s: string) => {
  const t = tokens(s);
  if (/^[\d\s]+$/.test(s.trim())) return true;
  if (t.some((w) => EN_WORDS.has(w) && !['no', 'in', 'a', 'e'].includes(w))) return true;
  const italian = t.filter((w) => known.has(w)).length;
  return t.length > 0 && italian / t.length <= 0.5;
};
const answers = (e: Exercise) => (Array.isArray(e.correct_answer) ? e.correct_answer : [e.correct_answer]);

function checkStyle(where: string, label: string, text: string | undefined) {
  if (!text) return;
  if (EM_DASH.test(text)) flag(where, 'warning', `em-dash in ${label}: "${text.slice(0, 80)}"`);
  const caps = text.match(CAPS);
  if (caps && !ACRONYMS.has(caps[0])) flag(where, 'warning', `capitals for emphasis in ${label}: "${caps[0]}"`);
}

/** The Italian strings an exercise shows (by field), skipping English answers. */
function italianOf(e: Exercise): [string, string][] {
  const out: [string, string][] = [];
  if (e.sentence_context && e.subtype !== 'find_mistake') out.push(['sentence', e.sentence_context.split('\n').map((l) => l.replace(/^[^:]{1,20}: /, '')).join(' ')]);
  for (const line of e.dialogue ?? []) if (line.text) out.push(['dialogue', line.text]);
  const meaningQuestion = /^(What does|What number|Write these digits)/.test(e.prompt.text ?? '');
  if (!meaningQuestion && e.subtype !== 'match_pairs') {
    for (const a of e.subtype === 'arrange_words' ? [answers(e).join(' ')] : answers(e)) if (!looksEnglish(a)) out.push(['answer', a]);
  }
  if (e.subtype === 'match_pairs') for (const p of answers(e)) out.push(['pair', p.split('|')[0]]);
  return out;
}

function checkExercise(where: string, e: Exercise, ids: Set<string>) {
  if (ids.has(e.id)) flag(where, 'error', `duplicate exercise id ${e.id}`);
  ids.add(e.id);
  const ans = answers(e);
  if (['fill_blank', 'cloze'].includes(e.subtype) && !e.sentence_context.includes('___')) flag(where, 'error', `${e.id}: no ___ blank`);
  if (e.subtype === 'arrange_words' && ans.join(' ') !== e.sentence_context) flag(where, 'warning', `${e.id}: arranged words don't rebuild the sentence`);
  if (e.subtype === 'dialogue_completion' && (e.dialogue ?? []).filter((l) => l.text === undefined).length !== 1)
    flag(where, 'error', `${e.id}: a dialogue needs exactly one learner line`);
  if (e.subtype === 'multiple_choice') {
    if (e.distractors.includes(ans[0])) flag(where, 'error', `${e.id}: the right answer is also a wrong option`);
    if (new Set(e.distractors).size !== e.distractors.length) flag(where, 'warning', `${e.id}: duplicate options`);
    const trueFalse = ['True', 'False'].includes(ans[0]);
    if (e.distractors.length < 2 && !trueFalse) flag(where, 'warning', `${e.id}: fewer than 2 wrong options`);
  }
  if (['type_answer', 'fill_blank', 'cloze', 'transformation', 'find_mistake'].includes(e.subtype)) {
    for (const a of ans) {
      if (!validateAnswerMulti(a, ans, { strictAccents: e.strict_accents }).correct)
        flag(where, 'error', `${e.id}: accepted answer "${a}" fails the validator`);
    }
  }
  checkStyle(where, `${e.id} prompt`, e.prompt.text);
  for (const h of e.hints) checkStyle(where, `${e.id} hint`, h);
  for (const a of ans) checkStyle(where, `${e.id} answer`, a);
}

// ── Taught-before ─────────────────────────────────────

const known = new Set<string>();
const introducedIn = new Map<string, string>();
const learn = (word: string, where: string) => {
  const parts = tokens(word).flatMap((t) => (t.includes("'") ? [t, ...t.split("'").filter(Boolean)] : [t]));
  for (const t of parts) for (const f of forms(t)) {
    if (!known.has(f)) introducedIn.set(f, where);
    known.add(f);
  }
};

function unknownWords(text: string): string[] {
  // Quoted words are mentioned, not used (Come si dice 'water' in italiano?)
  let t = text.replace(/’/g, "'").replace(/(^|\s)'[^']+'(?=[\s?.!,]|$)/g, ' ');
  for (const a of allowlist) t = t.replace(new RegExp(a.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ' ');
  const out: string[] = [];
  for (const tok of tokens(t)) {
    if (known.has(tok) || names.has(tok) || tok.length === 1) continue;
    // Elided forms: dov'è, l'insegnante, un'idea. Check each side.
    if (tok.includes("'")) {
      const [left, right] = tok.split("'");
      const leftOk = known.has(left + "'") || known.has(left);
      const rightOk = !right || known.has(right) || names.has(right);
      if (leftOk && rightOk) continue;
      if (!leftOk) out.push(left + "'");
      if (!rightOk) out.push(right);
      continue;
    }
    out.push(tok);
  }
  return [...new Set(out)];
}

function checkTaught(where: string, label: string, text: string) {
  const unknown = unknownWords(text);
  if (unknown.length) flag(where, ready(where) ? 'error' : 'warning', `${label}: not introduced yet: ${unknown.join(', ')}  ←  "${text.slice(0, 70)}"`);
}

const readyUnits = new Set(units.filter((u) => u.ready).map((u) => u.id));
const ready = (where: string) => [...readyUnits].some((u) => where.startsWith(u)) || GRAMMAR_PLAN.some((g) => g.ready && where.startsWith(g.id));

// ── Run ───────────────────────────────────────────────

const exerciseIds = new Set<string>();
const practised = new Map<string, Set<string>>(); // chapter → words used in exercises

// Names come from all content in the course, so a name used first at the start of a sentence still counts
for (const step of COURSE) {
  if (step.kind === 'grammar') {
    const practicePath = join(SRC, 'grammar', `${step.id}.practice.json`);
    if (existsSync(practicePath)) {
      const practice = readJson<GrammarPractice>(practicePath);
      for (const e of [...practice.stops.flatMap((st) => st.exercises), ...practice.mastery.exercises]) collectNamesFromExercise(e);
    }
  }
  if (step.kind === 'chapter') {
    for (const l of unitById.get(step.id)?.lessons ?? []) {
      const lesson = loadLesson(l.id);
      for (const e of lesson.exercises) collectNamesFromExercise(e);
      for (const p of lesson.reading?.paragraphs ?? []) collectNames(p.replace(/^[^:]{1,20}: /, ''));
      for (const v of lesson.vocabulary ?? []) collectNames(v.example);
    }
  }
}

for (const step of COURSE) {
  if (step.kind === 'grammar') {
    const unit = GRAMMAR_PLAN.find((g) => g.id === step.id);
    if (!unit) { flag('course', 'error', `unknown grammar unit ${step.id}`); continue; }
    for (const w of GRAMMAR_FORMS[step.id] ?? []) learn(w, step.id);
    const mdPath = join(SRC, 'grammar', `${step.id}.md`);
    if (!existsSync(mdPath)) { flag(step.id, 'warning', 'not written yet'); continue; }
    const md = readFileSync(mdPath, 'utf8');
    for (const it of readingItalian(md)) learn(it, step.id);
    checkStyle(step.id, 'reading', md.replace(/^---[\s\S]*?---/, ''));
    const practicePath = join(SRC, 'grammar', `${step.id}.practice.json`);
    if (!existsSync(practicePath)) continue;
    const practice = readJson<GrammarPractice>(practicePath);
    const headings = new Set([...md.matchAll(/^#{2,3} (.+)$/gm)].map((m) => m[1].replace(/[*_`]/g, '')));
    for (const stop of practice.stops) {
      if (!headings.has(stop.after)) flag(step.id, 'error', `practice stop "${stop.id}" follows a heading that doesn't exist: "${stop.after}"`);
    }
    for (const [key, p] of Object.entries(practice.points)) {
      if (!headings.has(p.section)) flag(step.id, 'error', `grammar point "${key}" links to a missing section: "${p.section}"`);
    }
    for (const e of [...practice.stops.flatMap((s) => s.exercises), ...practice.mastery.exercises]) {
      checkExercise(step.id, e, exerciseIds);
      for (const pt of e.grammar_points ?? []) if (!practice.points[pt]) flag(step.id, 'error', `${e.id}: unknown grammar point "${pt}"`);
      for (const [label, t] of italianOf(e)) checkTaught(step.id, `${e.id} ${label}`, t);
    }
    continue;
  }

  const unit = unitById.get(step.id);
  if (!unit) { flag('course', 'error', `unknown chapter ${step.id}`); continue; }
  if (!unit.ready && !ALL) continue;
  checkChapter(unit);
}

function checkChapter(unit: Unit) {
  const dir = join(SRC, 'units', unit.id);
  const files = new Set(readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', '')));
  const listed = new Set(unit.lessons.map((l) => l.id));
  for (const f of files) if (!listed.has(f)) flag(unit.id, 'error', `${f}.json isn't in the curriculum`);
  const used = new Set<string>();
  practised.set(unit.id, used);

  for (const meta of unit.lessons) checkLesson(unit, meta, used);

  // Coverage: words introduced in this chapter but never used in an exercise
  for (const meta of unit.lessons) {
    if (!existsSync(lessonFile(meta.id))) continue;
    for (const v of loadLesson(meta.id).vocabulary ?? []) {
      const parts = tokens(v.word);
      if (!parts.some((p) => forms(p).some((f) => used.has(f)))) flag(meta.id, 'info', `"${v.word}" is introduced but never practised`);
    }
  }
}

/**
 * One entry per word: a phrase that contains another entry from the same lesson (sto bene + bene)
 * should be folded into that word's meaning and example. Repeated examples are flagged too.
 */
function checkWordList(where: string, vocab: { word: string; example: string; phrase?: boolean }[]) {
  const singles = new Set(vocab.filter((v) => tokens(v.word).length === 1).map((v) => tokens(v.word)[0]));
  for (const v of vocab) {
    const parts = tokens(v.word);
    if (parts.length < 2 || v.phrase) continue;
    const overlap = parts.filter((p) => !LITTLE_WORDS.has(p) && singles.has(p));
    if (overlap.length) flag(where, 'warning', `"${v.word}" and "${overlap.join('", "')}" are both on the word list: fold the phrase into the word's meaning and example`);
  }
  const seen = new Map<string, string>();
  for (const v of vocab) {
    const ex = v.example.trim();
    if (seen.has(ex)) flag(where, 'warning', `"${v.word}" and "${seen.get(ex)}" share the example "${ex}"`);
    else seen.set(ex, v.word);
  }
}

function checkLesson(unit: Unit, meta: LessonMeta, used: Set<string>) {
  const where = meta.id;
  if (!existsSync(lessonFile(meta.id))) { flag(where, 'error', 'lesson file missing'); return; }
  const lesson = loadLesson(meta.id);
  if (lesson.unit_id !== unit.id) flag(where, 'error', `unit_id is ${lesson.unit_id}, expected ${unit.id}`);
  if (lesson.grammar_tips?.length) flag(where, 'warning', `${lesson.grammar_tips.length} grammar tips (explanations belong in grammar units)`);
  if (meta.role === 'reading' && !lesson.reading) flag(where, 'error', 'reading lesson without a reading text');
  if (meta.role === 'writing' && lesson.exercises.length !== 1) flag(where, 'warning', 'writing lessons have one text');
  if (meta.role !== 'speaking' && lesson.exercises.some((e) => e.subtype === 'read_aloud'))
    flag(where, 'warning', 'read-aloud belongs in the speaking lesson');

  // The lesson's own words come first (new-words screen), then everything it shows must be known
  for (const v of lesson.vocabulary ?? []) {
    learn(v.word, where);
    learn(v.meaning.split(/[·=]/).slice(1).join(' ').replace(/\([^)]*\)/g, ''), where); // Italian forms given in the meaning
    checkStyle(where, `word "${v.word}"`, v.meaning);
  }
  for (const v of lesson.vocabulary ?? []) checkTaught(where, `example for "${v.word}"`, v.example);
  checkWordList(where, lesson.vocabulary ?? []);
  for (const p of lesson.reading?.paragraphs ?? []) {
    checkTaught(where, 'reading', p.replace(/^[^:]{1,20}: /, ''));
    checkStyle(where, 'reading', p);
  }
  for (const e of lesson.exercises) {
    checkExercise(where, e, exerciseIds);
    for (const [label, t] of italianOf(e)) {
      checkTaught(where, `${e.id.slice(-5)} ${label}`, t);
      for (const tok of tokens(t)) used.add(tok);
    }
  }
}

// ── Profilo coverage ──────────────────────────────────

// The list writes some lemmas as pairs (amico/a, studente/ssa, chiamare/si): the first part is the lemma
const profilo = readJson<{ lemma: string }[]>(join(ROOT, 'data/profilo-a1-lemmas.json')).map((l) => l.lemma.toLowerCase());
const isTaught = (lemma: string) => known.has(lemma) || known.has(lemma.split('/')[0].trim());
const taught = profilo.filter(isTaught);
const missing = profilo.filter((l) => !isTaught(l));

// ── Print ─────────────────────────────────────────────

const ICON: Record<Level, string> = { error: '✗', warning: '!', info: '·' };
let errors = 0, warnings = 0, infos = 0;
for (const [where, items] of report) {
  const shown = items.filter((i) => i.level !== 'info' || process.argv.includes('--info'));
  if (!shown.length) { infos += items.length; continue; }
  console.log(`\n${where}`);
  for (const i of shown) console.log(`  ${ICON[i.level]} ${i.msg}`);
  for (const i of items) {
    if (i.level === 'error') errors++;
    else if (i.level === 'warning') warnings++;
    else infos++;
  }
}
console.log(`\nProfilo A1 words taught so far: ${taught.length} of ${profilo.length}`);
if (process.argv.includes('--missing')) console.log(`Not yet taught: ${missing.join(', ')}`);
console.log(`\n${errors} errors, ${warnings} warnings, ${infos} notes${process.argv.includes('--info') ? '' : ' (show with --info)'}`);
process.exit(errors > 0 ? 1 : 0);
