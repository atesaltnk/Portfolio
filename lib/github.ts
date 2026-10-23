// GitHub data layer: fetches public repositories and exposes them as a clean
// `Repo[]`. Runs on the server with ISR caching so the portfolio stays in sync
// with GitHub without a rebuild.

export const GITHUB_USERNAME =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME?.trim() || "atesaltnk"

export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`

export interface Repo {
  id: number
  name: string
  displayName: string
  description: string | null
  url: string
  homepage: string | null
  language: string | null
  stars: number
  forks: number
  topics: string[]
  createdAt: string
  updatedAt: string
  isFork: boolean
}

interface GitHubApiRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics?: string[]
  created_at: string
  pushed_at: string
  fork: boolean
  archived: boolean
  private: boolean
}

// Turn a repo slug like "friday-ai_assistant" into "Friday Ai Assistant".
function humanizeName(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Fetch all public repositories for the configured user, newest push first.
 * - Cached for 1 hour (ISR) so we stay within GitHub's unauthenticated rate limit.
 * - A `GITHUB_TOKEN` env var, if present, raises the rate limit but is optional.
 * - Skips the special `<user>/<user>` profile-README repo — it isn't a project.
 * - Returns `[]` on any failure so the UI can degrade gracefully.
 */
export async function getRepos(): Promise<Repo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed&type=owner`,
      { headers, next: { revalidate: 3600 } }
    )

    if (!res.ok) return []

    const data = (await res.json()) as GitHubApiRepo[]
    if (!Array.isArray(data)) return []

    return data
      .filter(
        (r) =>
          !r.private &&
          !r.archived &&
          r.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase()
      )
      .map(
        (r): Repo => ({
          id: r.id,
          name: r.name,
          displayName: humanizeName(r.name),
          description: r.description,
          url: r.html_url,
          homepage: r.homepage?.trim() ? r.homepage.trim() : null,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
          topics: r.topics ?? [],
          createdAt: r.created_at,
          updatedAt: r.pushed_at,
          isFork: r.fork,
        })
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  } catch {
    return []
  }
}

// GitHub linguist colours for the language marker on each row.
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
}

export function languageColor(language: string | null): string {
  if (!language) return "#ff4d12"
  return LANGUAGE_COLORS[language] ?? "#ff4d12"
}
