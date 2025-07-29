"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { BundledLanguage } from "shiki/langs"

interface CodeLanguageContextType {
  defaultCodeLanguage: BundledLanguage
  setDefaultCodeLanguage: (defaultCodeLanguage: BundledLanguage) => void
}

const CodeLanguageContext = createContext<CodeLanguageContextType | undefined>(
  undefined
)

export function useCodeLanguage() {
  const context = useContext(CodeLanguageContext)
  if (!context) {
    throw new Error(
      "useCodeLanguage must be used within a CodeLanguageProvider"
    )
  }
  return context
}

interface CodeLanguageProviderProps {
  children: ReactNode
}

export function CodeLanguageProvider({ children }: CodeLanguageProviderProps) {
  const [defaultCodeLanguage, setDefaultCodeLanguage] =
    useState<BundledLanguage>("bash")
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("defaultCodeLanguage")
      if (savedLanguage) {
        setDefaultCodeLanguage(savedLanguage as BundledLanguage)
      }
    }
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("defaultCodeLanguage", defaultCodeLanguage)
    }
  }, [defaultCodeLanguage, isHydrated])

  return (
    <CodeLanguageContext.Provider
      value={{
        defaultCodeLanguage,
        setDefaultCodeLanguage,
      }}
    >
      {children}
    </CodeLanguageContext.Provider>
  )
}

export const useDefaultCodeLanguage = () => useCodeLanguage()
