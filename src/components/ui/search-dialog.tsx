"use client"

import {
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import useDebounce from "@/hooks/use-debounce"
import { useTouchDevice } from "@/hooks/use-touch-device"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import DynamicIcon from "../dynamic-icon"

type ContentCategory =
  | "documentation"
  | "api"
  | "guide"
  | "component"
  | "tutorial"

interface SearchItem {
  id: number
  title: string
  icon?: string
  description?: string
  category: ContentCategory
  url: string
}

function useSearch() {
  const [results, setResults] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([])

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    try {
      setIsLoading(true)

      // Search blog posts via API
      const blogResponse = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      )
      const blogData = await blogResponse.json()
      const blogResults = blogData.results || []

      setResults(blogResults)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch(`/api/search`)
      .then((res) => res.json())
      .then((data) => setRecentSearches(data.results))
  }, [])

  return {
    results,
    isLoading,
    performSearch,
    recentSearches,
  }
}

interface SearchInputProps {
  className?: string
  query: string
  setQuery: (value: string) => void
  inputRef?: RefObject<HTMLInputElement | null>
}

const SearchInput = ({
  query,
  setQuery,
  className,
  inputRef,
}: SearchInputProps) => {
  return (
    <input
      ref={inputRef}
      className={cn(
        "border-gray-90 placeholder:text-gray-40 w-full border-b bg-transparent py-3.5 pr-16 pl-4 leading-snug tracking-tight remove-autocomplete-styles focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      type="text"
      placeholder="What are you searching for?"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      tabIndex={1}
    />
  )
}
SearchInput.displayName = "SearchInput"

interface ISearchHint extends Omit<SearchItem, "category" | "id"> {
  id?: number
  category?: ContentCategory
}

interface SearchHintProps extends ISearchHint {
  isSelected?: boolean
  dataIndex: number
  isLast?: boolean
  onMouseEnter: () => void
  onLinkClick: () => void
}

function SearchHint({
  url,
  title,
  description,
  icon,
  isSelected,
  dataIndex,
  isLast,
  onMouseEnter,
  onLinkClick,
}: SearchHintProps) {
  const isFirst = dataIndex === 0
  return (
    <Link
      className={cn(
        "group flex w-full cursor-pointer items-center gap-x-3 rounded-lg py-2.5 text-left outline-hidden transition-colors duration-150 focus-within:bg-gray-1 sm:pr-6 sm:pl-3",
        isSelected && "sm:bg-gray-1",
        isFirst && "scroll-mt-12",
        !isFirst && !isLast && "scroll-my-2",
        isLast && "scroll-mb-5"
      )}
      href={url}
      onMouseEnter={onMouseEnter}
      onClick={onLinkClick}
      tabIndex={-1}
      data-index={dataIndex}
    >
      <div className="flex flex-col gap-y-0.5">
        <p
          className={cn(
            "line-clamp-1 max-w-full text-base leading-tight font-medium tracking-tighter transition-colors duration-150"
          )}
        >
          {title}
        </p>
        {description && (
          <p
            className={cn(
              "line-clamp-1 max-w-full text-[0.8125rem] leading-snug font-book tracking-tighter text-gray-8 transition-colors duration-150"
            )}
          >
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}

interface SearchGroupProps<T extends ISearchHint> {
  title: string
  items: T[]
  startIndex: number
  selectedIndex: number | null
  totalItems: number
  onItemChange: (index: number) => void
  onLinkClick: () => void
}

function SearchGroup<T extends ISearchHint>({
  title,
  items,
  startIndex,
  selectedIndex,
  totalItems,
  onItemChange,
  onLinkClick,
}: SearchGroupProps<T>) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-y-3">
      <h3 className="text-[0.8125rem] leading-none font-medium tracking-tight text-black">
        {title}
      </h3>
      <ul>
        {items.map((item, index) => {
          const itemIndex = startIndex + index
          const isSearchItem = "category" in item

          return (
            <li
              key={
                isSearchItem
                  ? `${(item as SearchItem).category}-${index}`
                  : `item-${index}`
              }
            >
              <SearchHint
                {...item}
                isSelected={selectedIndex === itemIndex}
                isLast={itemIndex === totalItems - 1}
                dataIndex={itemIndex}
                onMouseEnter={() => onItemChange(itemIndex)}
                onLinkClick={onLinkClick}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const NoResultsFound = () => (
  <p className="pt-3 text-center text-sm leading-tight font-medium tracking-tight text-black">
    No results found.
  </p>
)

interface SearchDialogProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
}

export default function SearchDialog({
  open,
  onOpenChange,
}: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 300)
  const { results, isLoading, performSearch, recentSearches } = useSearch()
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const isTouchDevice = useTouchDevice()
  const inputRef = useRef<HTMLInputElement>(null)

  const allItems = useCallback((): {
    item: SearchItem
    index: number
  }[] => {
    if (!query) {
      return [...recentSearches.map((item, index) => ({ item, index }))] as {
        item: SearchItem
        index: number
      }[]
    } else {
      return results.map((item, index) => ({ item, index }))
    }
  }, [query, results, recentSearches])

  const items = allItems()
  const totalItems = items.length

  useEffect(() => {
    performSearch(debouncedQuery)
  }, [debouncedQuery, performSearch])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setSelectedIndex(0)
    } else {
      // Focus input when dialog opens
      setTimeout(() => {
        inputRef?.current?.focus()
      }, 0)
    }
  }, [open])

  const handleOpenAutoFocus = (event: Event) => {
    if (isTouchDevice) {
      event.preventDefault()
    }
  }

  const handleCloseAutoFocus = (event: Event) => {
    event.preventDefault()
  }

  const handleLinkClick = () => {
    onOpenChange?.(false)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()

      if (selectedIndex < totalItems - 1) {
        setSelectedIndex(selectedIndex + 1)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()

      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1)
      }
    } else if (e.key === "Enter" && selectedIndex !== null) {
      // handle escape button focus
      if ((e.target as HTMLElement)?.tabIndex === 2) {
        return
      }

      e.preventDefault()
      const selectedElement = document.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement
      if (selectedElement) {
        selectedElement.click()
      }
    } else if (e.key === "Escape") {
      setSelectedIndex(0)
    }
  }

  const handleItemChange = (index: number) => {
    setSelectedIndex(index)
  }

  useEffect(() => {
    setSelectedIndex(0)
  }, [results, query])

  // Auto-scroll to selected item
  useEffect(() => {
    if (isTouchDevice) return

    if (selectedIndex !== null) {
      const selectedElement = document.querySelector(
        `[data-index="${selectedIndex}"]`
      )
      if (selectedElement) {
        const blockOption = cn({
          start: selectedIndex === 0,
          end: selectedIndex === totalItems - 1,
          nearest: selectedIndex > 0 && selectedIndex < totalItems - 1,
        }) as ScrollLogicalPosition

        if (blockOption) {
          selectedElement.scrollIntoView({
            behavior: "smooth",
            block: blockOption,
          })
        }
      }
    }
  }, [selectedIndex, totalItems, isTouchDevice])

  const renderSearchResults = () => {
    if (results.length === 0) return <NoResultsFound />

    const resultsByCategory = results.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        acc[item.category].push(item)
        return acc
      },
      {} as Record<ContentCategory, SearchItem[]>
    )

    const categoryLabels: Record<ContentCategory, string> = {
      documentation: "Documentation",
      api: "API Reference",
      guide: "Guides",
      component: "Components",
      tutorial: "Tutorials",
    }

    let startIndex = 0
    const categories = Object.entries(resultsByCategory).map(
      ([category, items]) => {
        if (items.length === 0) return null

        const categoryElement = (
          <SearchGroup
            key={category}
            title={categoryLabels[category as ContentCategory]}
            items={items}
            startIndex={startIndex}
            selectedIndex={selectedIndex}
            totalItems={totalItems}
            onItemChange={handleItemChange}
            onLinkClick={handleLinkClick}
          />
        )

        startIndex += items.length
        return categoryElement
      }
    )

    return <>{categories}</>
  }

  return (
    <DialogContent
      className="top-auto bottom-0 h-[75dvh] w-full max-w-(--breakpoint-sm) translate-y-0 rounded-t-xl p-0 shadow-none outline-hidden data-[state=closed]:zoom-out-100 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=open]:zoom-in-100 data-[state=open]:slide-in-from-bottom-1/2 sm:top-[20dvh] sm:bottom-auto sm:h-auto sm:rounded-lg sm:data-[state=closed]:zoom-out-95 sm:data-[state=closed]:slide-out-to-bottom-1 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-bottom-1"
      onOpenAutoFocus={handleOpenAutoFocus}
      onCloseAutoFocus={handleCloseAutoFocus}
      has-custom-close
    >
      <DialogTitle className="sr-only">Search</DialogTitle>
      <div className="relative flex flex-col" onKeyDown={handleKeyDown}>
        <SearchInput
          className={cn(isTouchDevice && "pr-4")}
          query={query}
          setQuery={setQuery}
          inputRef={inputRef}
        />
        <DialogClose asChild>
          <Button
            className={cn(
              "border-gray-90 absolute top-3.5 right-4 rounded border outline-hidden",
              isTouchDevice && "hidden"
            )}
            variant="outline"
            tabIndex={2}
            size="xs"
          >
            <span className="sr-only">
              To close the search dialog, press Escape
            </span>
            <span className="text-xs leading-none tracking-tight" aria-hidden>
              Esc
            </span>
          </Button>
        </DialogClose>

        <ScrollArea className="max-h-[calc(75dvh-3.125rem)] sm:max-h-[min(calc(40rem-3.5rem),calc(60dvh-3.5rem))]">
          <div className="relative flex min-h-20 flex-col gap-y-5 overflow-hidden px-4 py-5">
            {isLoading && (
              <div className="flex justify-center pt-3">
                <div className="border-gray-90 size-5 animate-spin rounded-full border-2 border-t-transparent"></div>
              </div>
            )}

            {!isLoading && !query && (
              <>
                <SearchGroup
                  title="Recent"
                  items={recentSearches as ISearchHint[]}
                  startIndex={0}
                  selectedIndex={selectedIndex}
                  onItemChange={handleItemChange}
                  onLinkClick={handleLinkClick}
                  totalItems={totalItems}
                />
              </>
            )}

            {!isLoading && query && renderSearchResults()}
          </div>
          <ScrollBar className="invisible" orientation="horizontal" />
        </ScrollArea>
      </div>
    </DialogContent>
  )
}
