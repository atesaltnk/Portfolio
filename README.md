# Ateş Altınkaynak — Developer Portfolio

A fast, animated personal portfolio for a software developer. The **Projects** section is generated **automatically from GitHub** — every public repository shows up as a card, synced on a schedule with no rebuild required.

🌐 Live: [atesaltinkaynak.com](https://atesaltinkaynak.com)

## Highlights

- **GitHub-powered Projects** — repositories are fetched from the GitHub REST API on the server and cached with ISR (`revalidate: 3600`), so the site stays in sync with your account automatically.
- **Bilingual** — full Turkish / English support via a lightweight dictionary + context.
- **Dark, premium UI** — deep-green accent, Playfair Display + Inter, glassmorphism, and tasteful Framer Motion animations that respect `prefers-reduced-motion`.
- **Server-first data, client-side interactivity** — repos are loaded in Server Components; filtering and animation happen in Client Components.

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **GitHub REST API**

## How the GitHub sync works

All repository logic lives in [`lib/github.ts`](lib/github.ts):

- `getRepos()` fetches public repos for the configured user, drops archived ones, and sorts by stars then recency.
- The username defaults to `atesaltnk` and can be overridden with `NEXT_PUBLIC_GITHUB_USERNAME`.
- An optional `GITHUB_TOKEN` raises the API rate limit (the unauthenticated limit is fine for normal traffic thanks to caching).

```bash
# .env.local (both optional)
NEXT_PUBLIC_GITHUB_USERNAME=atesaltnk
GITHUB_TOKEN=ghp_xxx
```

## Getting Started

```bash
# install dependencies
npm install

# run the dev server
npm run dev

# build for production
npm run build && npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
portfolio/
├── app/              # Routes: home, work, about, process, contact
├── components/
│   ├── sections/     # Page sections (hero, featured-work, ...)
│   ├── ui/           # Reusable primitives
│   └── repo-card.tsx # GitHub project cards
├── lib/
│   ├── github.ts     # GitHub data layer (fetch + cache + mapping)
│   ├── dictionary.ts # TR / EN content
│   └── language-context.tsx
└── public/           # Static assets
```

## License

MIT © Ateş Altınkaynak
