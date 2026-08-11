# The Father Intelligence

A statically-generated marketing site and member dashboard for THE FATHER FINANCIAL
ANALYST MARKET UNIVERSE™ briefings.

Built with Next.js 15 (App Router), React 19, TypeScript and Tailwind CSS v4.

---

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000

> **First build needs an internet connection.** Typefaces are loaded through
> `next/font/google` (Cinzel, Instrument Sans, JetBrains Mono). Next.js downloads
> and self-hosts them at build time, so after the first successful build there is
> no runtime dependency on Google.

```bash
npm run build   # production build
npm start       # serve the production build
```

## Demo sign-in

| Email                  | Password       |
| ---------------------- | -------------- |
| member@thefather.io    | goldenthrone   |
| demo@thefather.io      | demo1234       |

---

## Routes

| Route                  | Rendering | What it is                                              |
| ---------------------- | --------- | ------------------------------------------------------- |
| `/`                    | Static    | Single-page public site                                  |
| `/login`               | Static    | Member sign-in                                           |
| `/dashboard`           | Dynamic   | Full briefing — every engine, matrix and execution note  |
| `/dashboard/[market]`  | SSG       | Six desks: gold, bitcoin, equities, dollar-fx, rates, energy |

`/dashboard/*` is protected by `src/middleware.ts`, which redirects signed-out
visitors to `/login`.

---

## Where the content lives

**All briefing content is in one file: `src/lib/reports.ts`.**

To publish a new briefing, edit that file and redeploy. Nothing else changes — no
component touches hard-coded numbers. The data was transcribed from the v8.2
briefing dated 6 August 2026 (London / New York pre-market).

Structure of that file:

- `BRIEFING` — date, session, version, mission score, strategic bias
- `COMMAND_ENGINES`, `QUANT_ENGINES`, `PROBABILITY_SCORES` — scored engines
- `MACRO_CAUSALITY`, `INTERMARKET_CHAIN` — the causal chains
- `GLOBAL_TAPE` — the instrument tape
- `LIQUIDITY_ZONES`, `SPOT_GOLD`, `FRAMEWORK_PIVOT` — drives the ladder graphic
- `SCENARIOS` — Hero vs Dragon™ paths and probabilities
- `COT_POSITIONING`, `FEAR_GREED`, `EDGEFINDER`, `TIMEFRAME_BIAS`
- `SUPPORTING_FACTORS`, `PRIMARY_RISK`, `EXECUTION_PLAN`
- `CLASSIFICATION` — the verified / framework-derived / AI-derived tiers
- `MARKET_DESKS` — the six desks, each with bias, conviction, drivers and levels

### Adding a desk

Append an entry to `MARKET_DESKS`. The sidebar, desk summary, login preview grid
and the static route at `/dashboard/[slug]` all pick it up automatically via
`generateStaticParams`.

---

## Design system — light & dark

The site ships with **two hand-built palettes**, not one inverted into the other.
**Light is the default.** Visitors switch with the sun/moon button in the header
(also in the login page and the dashboard sidebar), and the choice is remembered
in `localStorage` under `fi-theme`.

| | Light | Dark |
| --- | --- | --- |
| Direction | Warm ivory paper, deep bronze, aubergine — an engraved certificate | The crest's own world: obsidian, bright gold, royal purple |
| Background | `#f6f2e9` | `#07070b` |
| Text | `#191510` | `#ede8dc` |
| Gold accent | `#85641a` | `#d4a94e` |
| Royal accent | `#5d2eb8` | `#7c3fe4` |

Note that `--gold-hi` and `--gold-deep` mean *emphasis*, not lightness. On dark,
"hi" is brighter; on light, "hi" is darker. Both mean "more prominent."

### How the theming works

There are **no `dark:` prefixes anywhere in the markup.** Every palette value is a
plain CSS variable declared under `:root` / `[data-theme="light"]` and
`[data-theme="dark"]`. Those are then mapped to Tailwind utilities in an
**`@theme inline`** block:

```css
@theme inline {
  --color-fg: var(--fg);
}
```

The `inline` keyword is the important part. Without it Tailwind resolves the
variable at build time and bakes in a hex value, freezing the theme. With it,
`text-fg` compiles to `color: var(--fg)` and follows `[data-theme]` live.

Colours that can't be class names — signal dots, ladder zone bands — are driven
by data attributes with CSS rules (`.signal-dot[data-signal="positive"]`,
`.ladder-zone[data-tier="throne"]`) rather than inline hex from JavaScript. **If
you add a colour, add it as a variable in both palettes.** A hex literal in a
component will look wrong in one of the two themes.

Theme is applied by a small blocking script in `<head>` before first paint, so
there is no flash of the wrong palette on load. `suppressHydrationWarning` on
`<html>` is required because that script mutates the DOM before React hydrates.

### Contrast

Light-mode values were chosen against WCAG AA. Body text, muted text, gold,
royal and all three signal colours clear 4.5:1 on both the page background and
card surfaces. `--gold-deep` (3.06:1) and the gilt gradient (3.13:1) clear the
3:1 large-text threshold and are used only on display type and decorative marks.
If you change a colour, re-check it.

### Type

**Cinzel** for display (echoes the wordmark), **Instrument Sans** for body,
**JetBrains Mono** for all figures and labels.

Base resets sit inside `@layer base`. This matters — unlayered CSS beats layered
CSS in the cascade, so a global `border-color` outside a layer would silently
override every Tailwind border utility.

### The signature graphic

`src/components/LiquidityLadder.tsx` renders the Liquidity Heat Map™ as a vertical
price ladder. Zone heights are proportional to their real price ranges, so the
shape carries information rather than decoration. Gaps between zones (4000–4050,
4300–4350) are real gaps in the framework, left visible on purpose.

---

## Before this goes live

**1. Replace the authentication.** `src/lib/auth.ts` checks a hard-coded array and
stores a base64 cookie. That is a demo, not security. Swap in Auth.js, Clerk or
Supabase Auth, and use a signed and encrypted session. Remove the demo credentials
box from `src/app/login/page.tsx`.

**2. Keep the claims defensible.** The site deliberately does not claim to predict
markets ahead of time. It presents the briefing the way the briefing presents
itself — with an Intelligence Classification separating verified market prices from
framework-derived zones from AI-generated probabilities, and a risk notice in the
footer and on every dashboard page. Marketing copy promising foreknowledge of price
moves invites regulatory attention (in Nigeria, SEC questions around unregistered
investment advice). Adding it back would undercut the honesty the framework already
shows about itself.

**3. Point the email links somewhere real.** `access@thefatherintelligence.com`
appears on the landing page and login page as a placeholder.

**4. Add a real OG image.** Currently `/logo.png` is used, which is square; a
1200×630 render will present better when shared.

---

## Going from static to live

The obvious next step is replacing the static export in `reports.ts` with a data
source. Two options, in order of effort:

- **CMS-backed** — Sanity, Contentful or a Markdown/MDX folder. The briefing author
  publishes, the site revalidates. Keeps the current shape entirely; you would
  swap the imports for an async fetch and add `export const revalidate`.
- **Live prices** — pull the tape from a market data API and keep the analytical
  layers (zones, scores, verdicts) editorial. The Intelligence Classification
  already separates these two categories, so the UI is ready for it.
