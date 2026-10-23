import type { IconType } from "react-icons"
import {
  SiCplusplus,
  SiDrizzle,
  SiFramer,
  SiGit,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si"

export interface Tech {
  name: string
  Icon: IconType
  color: string
}

export const TECH: Tech[] = [
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#E2C41A" },
  { name: "React", Icon: SiReact, color: "#149ECA" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#0E0D0B" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Python", Icon: SiPython, color: "#3776AB" },
  { name: "C++", Icon: SiCplusplus, color: "#00599C" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
  { name: "SQLite", Icon: SiSqlite, color: "#0F80CC" },
  { name: "Prisma", Icon: SiPrisma, color: "#2D3748" },
  { name: "Drizzle", Icon: SiDrizzle, color: "#9BB516" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Framer Motion", Icon: SiFramer, color: "#0055FF" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "Vercel", Icon: SiVercel, color: "#0E0D0B" },
]
