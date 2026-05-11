"use client"

import React from "react"
import { usePathname } from "next/navigation"

import { Link } from "@/components/ui/link"
import DynamicIcon from "@/components/dynamic-icon"

interface IBreadcrumbItem {
  label: string
  href: string
  isLast: boolean
}

export default function Breadcrumbs({ firstLabel }: { firstLabel?: string }) {
  const pathname = usePathname()

  const generateBreadcrumbs = (): IBreadcrumbItem[] => {
    if (!pathname || pathname === "/") {
      return []
    }

    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs: IBreadcrumbItem[] = []

    segments.forEach((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/")
      const isLast = index === segments.length - 1

      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      breadcrumbs.push({
        label,
        href,
        isLast,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length === 0) {
    return null
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "https://novu.co"
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: index === 0 && firstLabel ? firstLabel : item.label,
      item: `${siteUrl}${item.href}`,
    })),
  }

  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2.5">
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center gap-x-2.5">
              {index > 0 && (
                <span className="text-sm leading-none font-medium tracking-tight text-gray-7">
                  /
                </span>
              )}
              {item.isLast ? (
                <span
                  aria-current="page"
                  className="text-sm leading-none tracking-tighter"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  className="text-sm leading-none tracking-tighter"
                  href={item.href}
                  variant="muted-dark"
                  size="sm"
                >
                  {index === 0 && <DynamicIcon icon="chevron-left" />}
                  {index === 0 ? firstLabel : item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  )
}
