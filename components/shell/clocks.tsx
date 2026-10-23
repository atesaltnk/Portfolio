"use client"

import { useEffect, useState } from "react"
import { Marquee } from "@/components/fx/marquee"
import { cn } from "@/lib/utils"

export const HOME_TZ = "Europe/Istanbul"

const CITIES = [
  { city: "Ankara", tz: HOME_TZ, home: true },
  { city: "Berlin", tz: "Europe/Berlin" },
  { city: "London", tz: "Europe/London" },
  { city: "New York", tz: "America/New_York" },
  { city: "San Francisco", tz: "America/Los_Angeles" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
]

/** Ticks every second; null on the server so the markup never mismatches. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

// Building an Intl formatter is far slower than using one, and every ticker
// redraws each second — so make them once per time zone.
const formatters = new Map<string, { time: Intl.DateTimeFormat; offset: Intl.DateTimeFormat }>()

function formattersFor(tz: string) {
  let f = formatters.get(tz)
  if (!f) {
    f = {
      time: new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      offset: new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" }),
    }
    formatters.set(tz, f)
  }
  return f
}

export function formatClock(now: Date | null, tz: string) {
  if (!now) return { time: "--:--:--", offset: "GMT" }
  const f = formattersFor(tz)
  const time = f.time.format(now)
  const offset = f.offset.formatToParts(now).find((p) => p.type === "timeZoneName")?.value ?? "GMT"
  return { time, offset }
}

/** mijobello's world-clock ticker: home city highlighted, the rest in passing. */
export function ClockTicker({ className }: { className?: string }) {
  const now = useNow()

  return (
    <Marquee duration={36} className={cn("t-label", className)}>
      {CITIES.map(({ city, tz, home }) => {
        const { time, offset } = formatClock(now, tz)
        return (
          <span key={city} className="flex shrink-0 items-center">
            <span
              className={cn(
                "flex items-center gap-2 px-2 py-1",
                home ? "bg-ember text-ink" : "text-fg"
              )}
            >
              <span>{city}</span>
              <span className="tabular-nums" suppressHydrationWarning>
                {time}
              </span>
              <span className={home ? "text-ink/60" : "text-faint"}>{offset}</span>
            </span>
            <span className="px-4 text-faint">/</span>
          </span>
        )
      })}
    </Marquee>
  )
}
