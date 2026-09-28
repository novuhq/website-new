import { ArrowLeft } from "lucide-react"

import { safeJsonLdStringify } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/site-url"
import { Link } from "@/components/ui/link"

interface DirectoryBreadcrumbProps {
  pathname: string
  title: string
}

export default function DirectoryBreadcrumb({
  pathname,
  title,
}: DirectoryBreadcrumbProps) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Templates",
        item: absoluteUrl("/directory"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: absoluteUrl(pathname),
      },
    ],
  }

  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm">
          <li>
            <Link
              className="group gap-1 leading-snug tracking-tighter"
              href="/directory"
              size="sm"
              variant="muted-dark"
            >
              <ArrowLeft
                className="size-3.5 transition-colors duration-200 group-hover:text-gray-8"
                aria-hidden
              />
              Templates
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <span className="text-gray-7" aria-hidden>
              &nbsp;/&nbsp;
            </span>
            <span className="leading-none" aria-current="page">
              {title}
            </span>
          </li>
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(breadcrumbJsonLd),
        }}
      />
    </>
  )
}
