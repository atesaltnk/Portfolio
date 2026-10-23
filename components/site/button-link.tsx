import Link from "next/link"
import type { ComponentProps } from "react"
import { RollText } from "@/components/fx/roll-text"
import { cn } from "@/lib/utils"

type Variant = "ember" | "outline" | "ink"

const VARIANTS: Record<Variant, string> = {
  ember: "bg-ember text-ink hover:bg-fg hover:text-bg",
  ink: "bg-fg text-bg hover:bg-ember hover:text-ink",
  outline: "border border-line-strong text-fg hover:border-fg hover:bg-fg hover:text-bg",
}

/** Square-edged CTA with a rolling label and a nudging arrow. */
export function ButtonLink({
  href,
  children,
  variant = "ember",
  external,
  className,
  arrow = "→",
  ...rest
}: {
  href: string
  children: string
  variant?: Variant
  external?: boolean
  className?: string
  arrow?: string
} & Omit<ComponentProps<"a">, "href" | "children">) {
  const classes = cn(
    "group inline-flex items-center justify-between gap-6 px-5 py-3.5 t-label !text-[11.5px] transition-colors duration-300",
    VARIANTS[variant],
    className
  )
  const inner = (
    <>
      <RollText>{children}</RollText>
      <span aria-hidden="true" className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
        {arrow}
      </span>
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {inner}
    </Link>
  )
}
