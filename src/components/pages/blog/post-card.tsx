import { IPost } from "@/types/blog"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import Authors from "@/components/pages/authors"
import Category from "@/components/pages/blog/category"
import Date from "@/components/pages/date"

interface IPostCardProps {
  className?: string
  post: IPost
  authorsPosition?: "left" | "bottom"
}

function PostCard({
  className,
  post,
  authorsPosition = "bottom",
}: IPostCardProps) {
  const { authors, isFeatured, publishedAt, title, url, caption, category } =
    post

  return (
    <article
      className={cn(
        "post-card--row flex flex-col justify-between gap-x-8 gap-y-3 md:flex-row",
        className
      )}
    >
      <div className="flex w-full flex-row-reverse items-center justify-end gap-x-2 gap-y-4 md:w-40 md:shrink-0 md:flex-col md:items-start md:justify-start md:pt-2 lg:w-56">
        <Date variant="blog" size="sm" publishedAt={publishedAt} />
        <div
          className="size-1 shrink-0 rounded-full bg-muted-foreground md:hidden"
          aria-hidden
        />
        <Category
          className={cn(
            authorsPosition !== "bottom" && !isFeatured && "flex md:hidden"
          )}
          isFeatured={isFeatured}
          category={category}
        />
        {authorsPosition === "left" && (
          <Authors
            className="hidden shrink-0 md:flex"
            authors={authors}
            size="sm"
            hideNamesOn={["md"]}
          />
        )}
      </div>
      <div className="flex grow flex-col">
        <h1>
          <Link
            className="line-clamp-2 text-2xl/tight font-medium tracking-tighter text-pretty hover:text-gray-9 md:text-[1.75rem]/tight"
            href={url}
            variant="clean"
          >
            {title}
          </Link>
        </h1>
        <p className="mt-2 line-clamp-3 text-base font-book tracking-tighter text-pretty text-gray-8 md:mt-3">
          {caption}
        </p>
        <Authors
          className={cn(
            "mt-4 shrink-0",
            authorsPosition === "left" && "md:hidden"
          )}
          authors={authors}
          size="sm"
        />
      </div>
    </article>
  )
}

export default PostCard
