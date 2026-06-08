"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import SchedulingModal from "@/components/pages/pricing/scheduling-modal"

type OpenSchedulingModal = (source: string) => void

const BookADemoSchedulingContext = createContext<OpenSchedulingModal | null>(
  null
)

function useBookADemoScheduling() {
  const context = useContext(BookADemoSchedulingContext)

  if (!context) {
    throw new Error(
      "useBookADemoScheduling must be used within BookADemoSchedulingProvider"
    )
  }

  return context
}

function BookADemoSchedulingProvider({ children }: { children: ReactNode }) {
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false)
  const [utmSource, setUtmSource] = useState<string | null>(null)

  const openSchedulingModal = useCallback((source: string) => {
    setUtmSource(source)
    setIsSchedulingModalOpen(false)
    setTimeout(() => setIsSchedulingModalOpen(true), 0)
  }, [])

  const closeSchedulingModal = useCallback(() => {
    setIsSchedulingModalOpen(false)
  }, [])

  const contextValue = useMemo(() => openSchedulingModal, [openSchedulingModal])

  return (
    <BookADemoSchedulingContext.Provider value={contextValue}>
      {children}
      <SchedulingModal
        key={utmSource}
        isOpen={isSchedulingModalOpen}
        utmCampaign="book_a_demo_enterprise"
        utmSource={utmSource}
        onClose={closeSchedulingModal}
      />
    </BookADemoSchedulingContext.Provider>
  )
}

export { BookADemoSchedulingProvider, useBookADemoScheduling }
