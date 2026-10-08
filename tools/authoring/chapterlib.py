"""Helpers for writing chapter lessons in the repo's JSON style."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lessonfmt import dump_lesson

V = lambda word, meaning, example: {"word": word, "meaning": meaning, "example": example}


class Lesson:
    def __init__(self, unit, unit_dir, n, name, role):
        self.unit = unit; self.dir = unit_dir; self.n = n; self.name = name; self.role = role
        self.id = f'{unit}-lesson-{n:02d}'; self.ex = []; self.vocab = []; self.reading = None

    def add(self, typ, sub, prompt, ctx, ans, dist=(), hints=(), words=(), **extra):
        self.ex.append({"id": f"{self.id}-ex-{len(self.ex) + 1:02d}", "type": typ, "subtype": sub, "prompt": {"text": prompt},
                        "sentence_context": ctx, "correct_answer": ans, "distractors": list(dist), "hints": list(hints),
                        "target_words": list(words), **extra})

    def meaning(self, word, ctx, ans, hint, words):  # Italian → English, typed
        self.add('vocab', 'type_answer', f"What does '{word}' mean?", ctx, ans, (), [hint], words)

    def mc(self, prompt, ans, dist, hint, words, ctx=''):
        self.add('vocab', 'multiple_choice', prompt, ctx, ans, dist, [hint], words)

    def cloze(self, prompt, ctx, ans, hint, words):
        self.add('writing', 'cloze', prompt, ctx, ans, (), [hint], words)

    def say(self, prompt, ans, hint, words):  # English → Italian, typed
        self.add('writing', 'type_answer', prompt, '', ans, (), [hint], words)

    def answer(self, question, ans, hint, words):  # answer a question about a text, in Italian
        self.add('writing', 'type_answer', f'Answer in Italian: {question}', question, ans, (), [hint], words)

    def line(self, situation, dialogue, ans, hint, words):
        ctx = '\n'.join(f"{l['speaker']}: {l.get('text', '___')}" for l in dialogue)
        self.add('writing', 'dialogue_completion', situation, ctx, ans, (), [hint], words, dialogue=dialogue)

    def arrange(self, prompt, sentence, extra, hint, words):
        self.add('writing', 'arrange_words', prompt, sentence, sentence.split(' '), extra, [hint], words)

    def fix(self, prompt, wrong, ans, hint, words):
        self.add('writing', 'find_mistake', prompt, wrong, ans, (), [hint], words)

    def read(self, sentence, hint, words):
        self.add('speaking', 'read_aloud', 'Read this aloud.', sentence, sentence, (), [hint], words)

    def write(self, prompt, model, hint, words):
        self.add('writing', 'free_form', prompt, '', model, (), [hint], words)

    def dump(self):
        d = {"id": self.id, "unit_id": self.unit, "name": self.name, "order": self.n, "grammar_tips": [],
             "exercises": self.ex, "vocabulary": self.vocab}
        if self.reading:
            d["reading"] = self.reading
        dump_lesson(d, f"{self.dir}/{self.id}.json")

    def meta(self, order):
        return f"            {{ id: '{self.id}', unit_id: '{self.unit}', name: {self.name!r}, role: '{self.role}', order: {order} }},"
