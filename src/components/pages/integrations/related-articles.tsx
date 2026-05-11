import Image from "next/image"

import type { IIntegrationRelatedArticle } from "@/types/integration"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

interface IRelatedArticlesProps {
  articles: IIntegrationRelatedArticle[]
  className?: string
}

function RelatedArticles({ articles, className }: IRelatedArticlesProps) {
  if (!articles.length) {
    return null
  }

  return (
    <section className={cn("flex w-full flex-col gap-8", className)}>
      <h2 className="font-display text-[28px] leading-tight tracking-tight text-foreground">
        Related Articles
      </h2>

      <ul className="overflow-hidden rounded-lg border border-gray-3">
        {articles.map((article) => (
          <li
            key={article.href.toString()}
            className="border-b border-gray-3 last:border-b-0"
          >
            <Link
              href={article.href}
              variant="clean"
              size="none"
              className="flex w-full flex-col items-start gap-3 p-5 no-underline transition-colors duration-200 hover:bg-gray-2"
            >
              {article.icon ? (
                <span className="relative size-6 shrink-0 overflow-hidden">
                  <Image
                    src={article.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="object-contain opacity-70"
                  />
                </span>
              ) : (
                <span
                  aria-hidden
                  className="inline-flex size-6 items-center justify-center rounded-full bg-gray-5 text-xs text-foreground/60"
                >
                  •
                </span>
              )}

              <span className="line-clamp-2 text-xl leading-snug font-medium tracking-tight text-foreground">
                {article.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RelatedArticles
