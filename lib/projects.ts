// Project layer: GitHub is the source of truth for *which* repos exist (new ones
// appear automatically); this file adds the editorial layer on top — localized
// copy, stack tags, chapter order and covers. If GitHub is unreachable, the
// curated entries are used on their own so the page never renders empty.

import type { Locale } from "./dictionary"
import { GITHUB_PROFILE_URL, type Repo } from "./github"

export type Localized = Record<Locale, string>

interface ProjectMeta {
  /** GitHub repository name (matched case-insensitively). */
  repo: string
  title: string
  year: number
  language: string
  stack: string[]
  summary: Localized
  blurb?: Localized
  /** Position in the "Selected work" chapters (1-based). */
  featured?: number
  cover?: string
  /** Overrides GitHub's homepage field. `null` hides a link that no longer works. */
  homepage?: string | null
}

export interface Project {
  key: string
  repo: string
  title: string
  url: string
  homepage: string | null
  language: string | null
  stars: number
  year: number
  updatedAt: string | null
  stack: string[]
  summary: Localized | null
  description: string | null
  blurb: Localized | null
  featured: number | null
  cover: string | null
}

const META: ProjectMeta[] = [
  {
    repo: "KladNet",
    title: "KladNet",
    year: 2025,
    language: "C++",
    stack: ["C++", "TypeScript", "Drones", "Real-time"],
    featured: 1,
    cover: "/work/kladnet.webp",
    summary: {
      en: "Earthquake response & drone relay network",
      tr: "Deprem müdahalesi ve dron röle ağı",
      de: "Erdbebenhilfe & Drohnen-Relaisnetz",
    },
    blurb: {
      en: "An earthquake-response system that keeps communication alive when infrastructure fails: it detects seismic events, analyses the affected region and deploys drones as a relay chain between the disaster zone and a communication hub.",
      tr: "Altyapı çöktüğünde iletişimi ayakta tutan bir deprem müdahale sistemi: sismik olayları algılar, etkilenen bölgeyi analiz eder ve afet bölgesi ile iletişim merkezi arasında röle zinciri kuran dronlar konuşlandırır.",
      de: "Ein Erdbeben-Reaktionssystem, das die Kommunikation aufrechterhält, wenn die Infrastruktur ausfällt: Es erkennt seismische Ereignisse, analysiert die betroffene Region und setzt Drohnen als Relaiskette zwischen Katastrophengebiet und Kommunikationsknoten ein.",
    },
  },
  {
    repo: "restup-core",
    title: "Rest-Up",
    year: 2026,
    language: "TypeScript",
    stack: ["Next.js 16", "PostgreSQL", "Drizzle", "Multi-tenant"],
    featured: 2,
    summary: {
      en: "Multi-tenant restaurant platform",
      tr: "Çok kiracılı restoran platformu",
      de: "Mandantenfähige Restaurant-Plattform",
    },
    blurb: {
      en: "A multi-tenant restaurant platform: a premium public site for every venue plus a protected admin for reservations, orders, inventory, staff and reporting — all on one tenant-aware Postgres schema.",
      tr: "Çok kiracılı bir restoran platformu: her mekân için şık bir web sitesi ve rezervasyon, sipariş, stok, personel ve raporlamayı yöneten korumalı bir yönetim paneli — hepsi kiracı farkında tek bir Postgres şemasında.",
      de: "Eine mandantenfähige Restaurant-Plattform: eine hochwertige öffentliche Website für jedes Lokal und ein geschütztes Admin-Panel für Reservierungen, Bestellungen, Lager, Personal und Reporting — alles auf einem mandantenfähigen Postgres-Schema.",
    },
  },
  {
    repo: "Cold-Chain-Sentinel",
    title: "Cold-Chain Sentinel",
    year: 2026,
    language: "TypeScript",
    stack: ["Next.js", "SSE", "libSQL", "Anomaly detection"],
    featured: 3,
    summary: {
      en: "Sensor-to-cloud cold-chain monitoring",
      tr: "Sensörden buluta soğuk zincir takibi",
      de: "Kühlketten-Monitoring vom Sensor zur Cloud",
    },
    blurb: {
      en: "Sensor-to-cloud temperature monitoring for cold-chain logistics. Virtual sensors stream readings into an anomaly engine, and a weighted 0–100 risk score explains why each shipment is safe — or not.",
      tr: "Soğuk zincir lojistiği için sensörden buluta sıcaklık takibi. Sanal sensörler verileri bir anomali motoruna akıtır; ağırlıklı 0–100 risk skoru her sevkiyatın neden güvende olduğunu — ya da olmadığını — açıklar.",
      de: "Temperaturüberwachung vom Sensor bis zur Cloud für die Kühlkette. Virtuelle Sensoren streamen Messwerte in eine Anomalie-Engine, und ein gewichteter Risikowert von 0–100 erklärt, warum jede Sendung sicher ist — oder nicht.",
    },
  },
  {
    repo: "Gercek-Orthopedics",
    title: "Gerçek Orthopedics",
    year: 2026,
    language: "TypeScript",
    stack: ["Next.js", "Prisma", "PostgreSQL", "i18n"],
    featured: 4,
    // gercekortopedi.com.tr currently answers 404 — re-enable once it's back up.
    homepage: null,
    summary: {
      en: "Bilingual clinic website with a content admin",
      tr: "İçerik panelli, iki dilli klinik sitesi",
      de: "Zweisprachige Klinik-Website mit Content-Admin",
    },
    blurb: {
      en: "A bilingual website for an orthopaedics centre in Ankara, with a content admin for announcements, blog posts and services.",
      tr: "Ankara'daki bir ortopedi merkezi için iki dilli web sitesi; duyurular, blog yazıları ve hizmetler için içerik yönetim paneliyle.",
      de: "Eine zweisprachige Website für ein Orthopädiezentrum in Ankara, mit einem Content-Admin für Ankündigungen, Blogbeiträge und Leistungen.",
    },
  },
  {
    repo: "FridayAI-OS",
    title: "Friday AI OS",
    year: 2024,
    language: "Python",
    stack: ["Python", "Voice", "Tkinter", "Automation"],
    featured: 5,
    summary: {
      en: "Modular voice & text desktop assistant",
      tr: "Modüler sesli ve yazılı masaüstü asistanı",
      de: "Modularer Sprach- & Text-Desktop-Assistent",
    },
    blurb: {
      en: "A modular desktop assistant in Python with voice and text modes — speech recognition, text-to-speech, email, weather and a small GUI, built to run on modest hardware.",
      tr: "Python ile yazılmış, sesli ve yazılı modları olan modüler bir masaüstü asistanı — konuşma tanıma, metin okuma, e-posta, hava durumu ve küçük bir arayüz; mütevazı donanımda çalışacak şekilde tasarlandı.",
      de: "Ein modularer Desktop-Assistent in Python mit Sprach- und Textmodus — Spracherkennung, Text-to-Speech, E-Mail, Wetter und eine kleine GUI, gebaut für bescheidene Hardware.",
    },
  },
  {
    repo: "Sample-Restaurant-Website",
    title: "Barle Kitchen & Pub",
    year: 2025,
    language: "TypeScript",
    stack: ["Next.js", "Tailwind", "Responsive"],
    cover: "/work/barle.webp",
    // barle.vercel.app now serves an unrelated site, so the link is hidden.
    homepage: null,
    summary: {
      en: "Restaurant & pub website with menu, events and reservations",
      tr: "Menü, etkinlik ve rezervasyonlu restoran sitesi",
      de: "Restaurant-Website mit Menü, Events und Reservierung",
    },
  },
  {
    repo: "amrowmedia",
    title: "AMRow Media",
    year: 2026,
    language: "TypeScript",
    stack: ["Next.js 16", "Framer Motion", "Tailwind"],
    summary: {
      en: "Rebuild of a photographer & videographer's website",
      tr: "Bir fotoğrafçı ve video prodüktörünün sitesinin yeniden yapımı",
      de: "Neuaufbau der Website einer Fotografin & Videografin",
    },
  },
  {
    repo: "Portfolio",
    title: "Portfolio",
    year: 2022,
    language: "TypeScript",
    stack: ["Next.js", "Framer Motion", "Lenis"],
    summary: {
      en: "This site — synced live from GitHub",
      tr: "Bu site — GitHub'dan canlı senkronize",
      de: "Diese Website — live mit GitHub synchronisiert",
    },
  },
]

const META_BY_REPO = new Map(META.map((m) => [m.repo.toLowerCase(), m]))

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function fromMeta(m: ProjectMeta): Project {
  return {
    key: slugify(m.repo),
    repo: m.repo,
    title: m.title,
    url: `${GITHUB_PROFILE_URL}/${m.repo}`,
    homepage: m.homepage ?? null,
    language: m.language,
    stars: 0,
    year: m.year,
    updatedAt: null,
    stack: m.stack,
    summary: m.summary,
    description: null,
    blurb: m.blurb ?? null,
    featured: m.featured ?? null,
    cover: m.cover ?? null,
  }
}

function fromRepo(r: Repo): Project {
  const m = META_BY_REPO.get(r.name.toLowerCase())
  return {
    key: slugify(r.name),
    repo: r.name,
    title: m?.title ?? r.displayName,
    url: r.url,
    homepage: m && "homepage" in m ? m.homepage ?? null : r.homepage,
    language: r.language ?? m?.language ?? null,
    stars: r.stars,
    year: new Date(r.createdAt).getFullYear(),
    updatedAt: r.updatedAt,
    stack: m?.stack ?? (r.language ? [r.language] : []),
    summary: m?.summary ?? null,
    description: r.description,
    blurb: m?.blurb ?? null,
    featured: m?.featured ?? null,
    cover: m?.cover ?? null,
  }
}

/** Every public repository, newest push first, enriched with curated copy. */
export function buildProjects(repos: Repo[]): Project[] {
  if (repos.length === 0) return META.map(fromMeta)
  return repos.map(fromRepo)
}

/** The curated "Selected work" chapters, in editorial order. */
export function featuredProjects(projects: Project[]): Project[] {
  return projects
    .filter((p) => p.featured !== null)
    .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0))
}

export interface ProjectStats {
  repos: number
  languages: number
  live: number
  since: number
}

export function projectStats(projects: Project[]): ProjectStats {
  const languages = new Set(projects.map((p) => p.language).filter(Boolean))
  const years = projects.map((p) => p.year).filter((y) => Number.isFinite(y))
  return {
    repos: projects.length,
    languages: languages.size,
    live: projects.filter((p) => p.homepage).length,
    since: years.length ? Math.min(...years) : new Date().getFullYear(),
  }
}

/** Pick the localized one-liner, falling back to GitHub's description. */
export function projectSummary(p: Project, locale: Locale): string | null {
  return p.summary?.[locale] ?? p.description
}
