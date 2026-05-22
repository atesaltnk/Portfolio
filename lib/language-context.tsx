"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { dictionary, type Locale, type Dictionary } from "./dictionary"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
  }

  const t: Dictionary = dictionary[locale]

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
