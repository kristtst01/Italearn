# Design System

The visual language of ItaLearn: Olivetti-inspired colour and type, with Mediterranean touches (majolica tiles, postage stamps) for progress and rewards. Calm, focused UI; the personality lives in a few deliberate places.

Mockup (reference only, not production code): https://claude.ai/artifact/PZm3G6HYWHt9S9NLkhLDWM. The **Structure** page has the screens and the **Palettes** page has the colour and type directions ("Final mix" is the chosen one).

**Single source of truth:** all colours, fonts and radii are defined as tokens in [frontend/src/index.css](../frontend/src/index.css). Components use token names (`bg-primary`, `text-learned`, `font-display`), never raw colours (`bg-blue-500`, `#1F4FA8`, `text-[#...]`). Run `npm run lint:tokens` to find violations.

## Principles

1. **Mostly black on white.** Colour is used only where it means something.
2. **One standout per screen.** Each screen has at most one bold coloured element (e.g. the session card on Today, the stamp book on Progress). Everything else stays quiet.
3. **Fun lives in the background.** Large Olivetti shapes (circles, half-circles), 2–3 per screen, partly cut off by the screen edges, **only in genuinely empty space**. Never behind cards, text, or controls. On reading pages, only in the margins.
4. **Reading pages prioritize completeness.** Grammar units are long-form reading. Typography and tables serve the content; no decoration inside the text column.
5. **Consistent components.** One button family, one card style, one way to show status. No one-off variants.
6. **Three layouts, chosen by width.** Mockups: the "Screen sizes" page of the design canvas.
   - **Full** (from 1024px, `lg:`): top bar with section links, sidebars beside the content. Designed against a 13–14" laptop viewport of 1280 × 600, so the main action stays above the fold.
   - **Half a laptop screen** (600–1023px, `sm:`): same top bar, tighter; sidebars move above or below the content (Chapter's grammar strip, the grammar unit's Contents bar), grids keep two columns.
   - **Phone** (below 600px, the unprefixed base): bottom tab bar, single column, full-width primary buttons. A narrow or zoomed-in desktop window gets this too.
   - Width decides the layout; touch only changes details (`pointer-coarse:`): keyboard hints and number keys are hidden, never the layout.
   - Titles and headings scale smoothly between the sizes (`clamp()` in the type scale). Background shapes appear only in the full layout, where there is empty space for them.

## Colour

### Palette

| Name | Hex | Token | Used for |
|---|---|---|---|
| Bianco | `#FCFCFA` | `bianco` | Page background |
| White | `#FFFFFF` | `white` | Cards, top bar, inputs |
| Nero | `#1B1B1B` | `nero` | Text, secondary button outline |
| Grigio | `#55504A` | `grigio` | Secondary text, labels |
| Linea | `#E4E4E0` | `linea` | Borders, dividers |
| Vuoto | `#E6E2DA` | `vuoto` | Empty progress, unstarted tiles |
| Vermiglione | `#E0482B` | `vermiglione` | Background shapes, active nav underline, "recommended" dot, fading |
| Vermiglione scuro | `#B8341B` | `vermiglione-scuro` | Primary buttons, earned stamps, corrections (text-safe on white) |
| Ocra | `#D9A23A` | `ocra` | In progress; background shapes |
| Cobalto | `#1F4FA8` | `cobalto` | Links, grammar, tile lines; standout cards |
| Verde bottiglia | `#1F5E4A` | `verde` | Learned, correct |
| Maiolica | `#FBF6EC` | `maiolica` | Tile glaze (only inside majolica tiles) |

### Meaning (semantic tokens)

Components should prefer these over the palette names.

| Semantic token | Maps to | Meaning |
|---|---|---|
| `background` | Bianco | Page background |
| `foreground` | Nero | Default text |
| `muted-foreground` | Grigio | Secondary text |
| `border` | Linea | Borders |
| `primary` | Vermiglione scuro | The one main action on a screen |
| `learned` | Verde | Learned / mastered / correct |
| `in-progress` | Ocra | Started but not finished |
| `fading` | Vermiglione | Knowledge that is slipping, needs review |
| `grammar` | Cobalto | Grammar units, links |
| `correction` | Vermiglione scuro | Red-pen corrections |

**Status colours are fixed: green = learned, ochre = in progress.** Never swap them, and don't use them decoratively.

### Contrast

Text on white must be at least 4.5:1. Vermiglione (`#E0482B`) and Ocra are **not** text-safe for small text. Use Vermiglione scuro for red text and for white-on-red buttons, and never put small text on Ocra. Grey text uses Grigio, not lighter.

## Typography

| Role | Font | Token |
|---|---|---|
| Headings, numbers, stamp titles | Archivo Black | `font-display` |
| Everything else (UI and reading) | Archivo | `font-sans` |
| Red-pen corrections only | Caveat | `font-hand` |

Fonts are self-hosted via `@fontsource` packages (no Google Fonts request).

**Scale** (px):

| Use | Size | Notes |
|---|---|---|
| Page title | 44 | Archivo Black, tight tracking |
| Section heading | 24 | Archivo Black |
| Card title | 17 | Archivo, bold |
| Reading body (grammar units) | 17 | Line height 1.6, measure ≤ 700px |
| Lesson texts (reading lessons) | 18–22 | `text-passage`: grows with the window. Line height 1.6, measure `max-w-prose`. The text's line length sets the layout width; the question sits beside it in `--container-aside` |
| Body | 16 | |
| Secondary text | 14 | Minimum size for normal text |
| Labels | 12 | Uppercase, bold, letter-spacing 1.2px, Grigio. Only for short labels. |

## Spacing, shape, layout

- Use Tailwind's spacing scale; avoid arbitrary values (`p-[13px]`).
- Page padding: 16px on a phone, 24px at half width, 56px in the full layout (`px-4 sm:px-6 lg:px-14`), all set by `Page`. Top bar height: 52 / 56 / 64px.
- Cards: white, 1px `border` colour, radius 10px. No shadows. Use the `panel` utility (`index.css`) and add padding and any accent (`border-t-5 border-t-correction`) where it's used.
- Standout cards (e.g. Today's session): solid Cobalto, square corners, white text.
- Gaps: 8 / 12 / 16 / 24 / 32 / 48.

## Components

- **Top bar:** white, logo (vermilion circle and ochre half-circle + "ItaLearn" in Archivo Black), section links, active link has a 3px vermilion underline. No sidebar. Below the full layout the streak shows as a flame and the number, and Profile is an avatar; on a phone the section links move to a bottom tab bar (Today, Library, Grammar with the majolica tile icon, Progress).
- **Buttons:** primary = filled Vermiglione scuro, white text, radius 10. Secondary = 2px Nero outline, transparent. Text link = Cobalto. One primary per screen.
- **Status:** small coloured dot + text ("Learned", "In progress", "Recommended next"). Not filled chips.
- **Progress bar:** thin (4px on cards, 10px on Progress), Vuoto track, green then ochre segments.
- **Majolica tile:** square, Maiolica glaze, 1px Cobalto border, diamond in the status colour (green / ochre / Vuoto), Cobalto centre dot. Used for grammar-unit progress.
- **Stamp:** white, dotted border. Earned: Vermiglione scuro border, title and postmark dot. Unearned: grey dotted border, grey title, empty ring (no transparency). Title in Archivo Black, Italian. Used on the Chapter page and in the Progress stamp book only.
- **Postcard:** airmail border (diagonal Vermiglione / white / Cobalto stripes) around a white panel, with a tilted Cobalto postmark. Only for the stamp book.
- **Background shapes:** Vermiglione / Cobalto circles and Ocra half-circles, absolutely positioned behind content, following Principle 3.
- **Placeholder (coming soon):** for features that exist in the design but aren't built. White card, 2px dashed Linea-grey border, radius 10, a small "Coming soon" label (uppercase, Grigio), the feature's name and one line on what it will do. Disabled controls inside it (e.g. a play button) are grey and not clickable. Same size and position as the real thing will have, so nothing moves when it ships.
- **Exercise screen ("Focus", chosen 2026-09-29; mockup page "Exercises", direction A):** session header with chapter + lesson name, segmented progress (one segment per exercise: green right, vermilion wrong, cobalt outline for current), counter and the chapter's stamp. The exercise is centred on screen (≈760px wide). The Italian word or phrase being tested is the hero in large Archivo Black, with its sentence and an audio button beside it. Answers carry number keys (1–4, also on the keyboard). Check sits directly under the answers; after checking, the answer area shows right (green) and wrong (struck through in vermilion), and a feedback card replaces the Check row ("Giusto!" / "Not quite" with red-pen correction and the hint). Quiet background shapes in the corners.
- **Correction:** wrong text struck through in Vermiglione scuro, the correction handwritten after it in Caveat.

## Status of the code

The tokens are defined in `index.css`, and shadcn's variables map onto them. Tailwind's default palette is switched off, so raw colours don't compile, and `npm run lint:tokens` reports none. Shared building blocks (`PageHeader`, `Page`, `Shapes`, `Logo`, `Count`, `StatRow`, `Status`, tiles, stamps, `Postcard`, `Correction`) live in `shared/components/design.tsx`; exercise primitives are in `features/exercises/ui.tsx`.
