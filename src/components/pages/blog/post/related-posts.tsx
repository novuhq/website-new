import { IPost } from "@/types/blog"
import { Link } from "@/components/ui/link"
import StackedAvatars from "@/components/pages/stacked-avatars"

const defaultAuthorImage = "/images/placeholder-author.svg"

function RelatedPosts({ articles }: { articles: IPost[] }) {
  return (
    <>
      <h2 className="mt-24 text-[1.75rem] leading-dense font-medium tracking-tight md:text-[2rem]">
        Read More
      </h2>
      <ul className="mt-8 flex flex-col overflow-hidden rounded-[8px] border border-gray-3">
        {articles?.map(({ slug, url, title, category, authors }) => {
          if (!slug && !url) return null

          return (
            <li
              className="border-b border-gray-3 last:border-0"
              key={slug.current}
            >
              <Link
                className="flex items-center justify-between gap-x-10 p-4 transition-colors duration-200 hover:bg-gray-2"
                href={url}
              >
                <div className="flex flex-col gap-y-2.5">
                  <h3 className="text-base leading-snug font-medium tracking-tighter text-white md:text-[20px]">
                    {title}
                  </h3>
                  <span className="order-first text-[0.875rem] leading-tight font-medium">
                    {category.title}
                  </span>
                </div>
                <StackedAvatars
                  avatars={authors.map(
                    ({ photo }) => photo || defaultAuthorImage
                  )}
                  names={authors.map(({ name }) => name)}
                  priority={false}
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default RelatedPosts
