import { GITHUB_USERNAME, languageColor } from "@/lib/github"
import type { Project } from "@/lib/projects"
import { cn } from "@/lib/utils"

function hostOf(project: Project) {
  if (project.homepage) {
    try {
      return new URL(project.homepage).host
    } catch {}
  }
  return `github.com/${GITHUB_USERNAME}/${project.repo}`
}

/** A generated "spec sheet" cover for projects without a screenshot. */
function TypeCover({ project }: { project: Project }) {
  const color = languageColor(project.language)
  return (
    <div className="scheme-ink relative h-full w-full overflow-hidden [container-type:size]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1.3px)",
          backgroundSize: "14px 14px",
        }}
      />
      <span
        aria-hidden="true"
        className="font-display absolute -bottom-[0.22em] -right-[0.04em] leading-none text-paper/[0.07]"
        style={{ fontSize: "min(95cqh, 70cqw)" }}
      >
        {project.title.charAt(0)}
      </span>
      <div className="relative flex h-full flex-col justify-between p-[5.5cqw]">
        <div className="t-label flex justify-between gap-4 text-dim" style={{ fontSize: "max(9px, 2.1cqw)" }}>
          <span className="truncate">{project.repo}</span>
          <span>{project.year}</span>
        </div>
        <div>
          <span className="mb-[3cqw] block h-[1.2cqw] min-h-1 w-[12cqw]" style={{ background: color }} />
          <p className="font-display leading-[0.86]" style={{ fontSize: "min(13cqw, 30cqh)" }}>
            {project.title}
          </p>
        </div>
        <div className="flex flex-wrap gap-[1.2cqw]">
          {project.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="t-label border border-line px-[1.6cqw] py-[0.8cqw]"
              style={{ fontSize: "max(8.5px, 1.9cqw)" }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Project visual inside a minimal browser-chrome frame, screenshot or generated. */
export function ProjectCover({
  project,
  className,
  priority = false,
}: {
  project: Project
  className?: string
  priority?: boolean
}) {
  return (
    <div className={cn("flex h-full w-full flex-col border border-line bg-bg", className)}>
      <div className="flex shrink-0 items-center gap-3 border-b border-line px-3 py-2">
        <span aria-hidden="true" className="flex gap-1">
          <i className="size-1.5 bg-ember" />
          <i className="size-1.5 bg-line-strong" />
          <i className="size-1.5 bg-line-strong" />
        </span>
        <span className="t-label truncate text-dim">{hostOf(project)}</span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {project.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover}
            alt={project.title}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ) : (
          <TypeCover project={project} />
        )}
      </div>
    </div>
  )
}
