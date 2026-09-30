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
6. **Desktop first.** Mobile is out of scope for now.

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
| Body | 16 | |
| Secondary text | 14 | Minimum size for normal text |
| Labels | 12 | Uppercase, bold, letter-spacing 1.2px, Grigio. Only for short labels. |

## Spacing, shape, layout

- Use Tailwind's spacing scale; avoid arbitrary values (`p-[13px]`).
- Page padding: 56px horizontal (`px-14`). Top bar height: 64px.
- Cards: white, 1px `border` colour, radius 10px. No shadows.
- Standout cards (e.g. Today's session): solid Cobalto, square corners, white text.
- Gaps: 8 / 12 / 16 / 24 / 32 / 48.

## Components

- **Top bar:** white, 64px, logo (vermilion circle and ochre half-circle + "ItaLearn" in Archivo Black), section links, active link has a 3px vermilion underline. No sidebar.
- **Buttons:** primary = filled Vermiglione scuro, white text, radius 10. Secondary = 2px Nero outline, transparent. Text link = Cobalto. One primary per screen.
- **Status:** small coloured dot + text ("Learned", "In progress", "Recommended next"). Not filled chips.
- **Progress bar:** thin (4px on cards, 10px on Progress), Vuoto track, green then ochre segments.
- **Majolica tile:** square, Maiolica glaze, 1px Cobalto border, diamond in the status colour (green / ochre / Vuoto), Cobalto centre dot. Used for grammar-unit progress.
- **Stamp:** white, dotted border. Earned: Vermiglione scuro border, title and postmark dot. Unearned: grey dotted border, grey title, empty ring (no transparency). Title in Archivo Black, Italian. Used on the Chapter page and in the Progress stamp book only.
- **Postcard:** airmail border (diagonal Vermiglione / white / Cobalto stripes) around a white panel, with a tilted Cobalto postmark. Only for the stamp book.
- **Background shapes:** Vermiglione / Cobalto circles and Ocra half-circles, absolutely positioned behind content, following Principle 3.
- **Correction:** wrong text struck through in Vermiglione scuro, the correction handwritten after it in Caveat.

## Status of the code

The tokens are defined in `index.css`, and shadcn's variables map onto them. Most existing components still use raw Tailwind colours (about 400 uses at the time of writing). They get migrated as screens are rebuilt for the new structure. `npm run lint:tokens` lists what's left. Once it reports zero, Tailwind's default colour palette gets removed so raw colours can't come back.
