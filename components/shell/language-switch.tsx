"use client"

import { useLanguage } from "@/lib/language-context"
import { LOCALES } from "@/lib/dictionary"
import { cn } from "@/lib/utils"

/** TR / EN / DE toggle with a single sliding indicator. */
export function LanguageSwitch({ className, size = "sm" }: { className?: string; size?: "sm" | "lg" }) {
  const { locale, setLocale } = useLanguage()
  const index = Math.max(0, LOCALES.indexOf(locale))

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn("relative grid grid-cols-3 border border-line-strong", className)}
    >
      <span
        aria-hidden="true"
        data-testid="language-toggle-indicator"
        className="absolute inset-y-0 left-0 w-1/3 bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={cn(
            "relative z-10 uppercase transition-colors duration-300",
            size === "sm" ? "t-label px-2.5 py-1.5" : "font-display t-h3 px-4 py-3",
            locale === code ? "text-bg" : "text-dim hover:text-fg"
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
