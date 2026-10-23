# Ateş Altınkaynak — Developer Portfolio

An editorial, motion-rich portfolio for a software developer. *Ateş* is Turkish for **fire** — so the signature element is a real-time ASCII rendering of the classic doom-fire algorithm. Projects are **synced automatically from GitHub**: every public repository appears in the index with no rebuild required.

🌐 Live: [atesaltinkaynak.com](https://atesaltinkaynak.com)

## Highlights

- **ASCII fire** — the doom-fire cellular automaton drawn from a pre-rendered glyph atlas, on the GPU via a single WebGL shader where available; the pointer acts as a torch, and it pauses offscreen ([`components/fx/ascii-fire.tsx`](components/fx/ascii-fire.tsx), [`fire-gl.ts`](components/fx/fire-gl.ts)).
- **GitHub-synced work** — repos are fetched on the server and cached with ISR (`revalidate: 3600`). A small editorial layer ([`lib/projects.ts`](lib/projects.ts)) adds localized copy, stack tags, chapter order and covers; new repos still appear automatically, and if GitHub is unreachable the curated entries are shown instead of an empty page.
- **Scroll storytelling** — a pinned "Selected work" chapter reel, a scroll-scrubbed manifesto, odometer counters, a checkered pixel transition, hover previews that trail the cursor.
- **Trilingual** — Turkish / English / German, with `lang` kept in sync so Turkish uppercasing (i → İ) is correct.
- **Motion that respects people** — follows `prefers-reduced-motion` by default, with a Full / Calm toggle in the footer and menu. Content never depends on JS to become visible: intros are CSS, reveals use native scroll-driven animations as progressive enhancement.
- **Press `D`** with the footer's fire on screen to draw into it; press `D` again and the sketch drops, tips over and burns into embers that feed the flames ([`components/fx/fire-sketch.tsx`](components/fx/fire-sketch.tsx)).

## Design system

- **Type:** Archivo (variable — width 62 for the condensed display cut, 100 for reading), Anybody heavy italic for the *Ateş* wordmark, and JetBrains Mono for labels and data.
- **Colour:** paper `#EDEAE4`, ink `#0E0D0B`, one ember accent `#FF4D12`. Sections switch scheme with `scheme-paper` / `scheme-ink`; the header follows whichever section is beneath it.
- **Layout:** every section sits in a hairline frame on a 12-column grid that lines up with the overlay.

Interaction pieces were adapted from MIT-licensed components listed on [21st.dev](https://21st.dev): TextRoll and TextScramble ([motion-primitives](https://github.com/ibelick/motion-primitives)), TextReveal and NumberTicker ([Magic UI](https://github.com/magicuidesign/magicui)).

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis · GitHub REST API

## GitHub sync

- `getRepos()` in [`lib/github.ts`](lib/github.ts) fetches public repos (skipping archived ones and the profile-README repo), newest push first.
- The username defaults to `atesaltnk`; override it with `NEXT_PUBLIC_GITHUB_USERNAME`.
- An optional `GITHUB_TOKEN` raises the API rate limit.

```bash
# .env.local (both optional)
NEXT_PUBLIC_GITHUB_USERNAME=atesaltnk
GITHUB_TOKEN=ghp_xxx
```

To feature a project, give its repo an entry with `featured` in [`lib/projects.ts`](lib/projects.ts); covers live in `public/work/`.

## Getting started

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

## Project structure

```
portfolio/
├── app/                # Routes: home, work, about, process, contact
├── components/
│   ├── fx/             # ASCII fire, roll text, scramble, odometer, marquee, …
│   ├── home/           # Home sections (hero, manifesto, chapters, index, …)
│   ├── pages/          # Client views for work and about
│   ├── shell/          # Header, menu, footer, preloader, cursor, clocks
│   ├── site/           # Shared pieces (section heads, buttons, covers, tech)
│   └── ui/             # shadcn/ui primitives
├── lib/
│   ├── github.ts       # GitHub data layer
│   ├── projects.ts     # Editorial layer over the repos
│   ├── dictionary.ts   # TR / EN / DE content
│   └── motion-pref.ts  # Full / Calm motion preference
└── public/work/        # Project covers and portrait
```

## License

MIT © Ateş Altınkaynak
