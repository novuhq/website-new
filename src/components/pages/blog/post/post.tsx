import { ROUTE } from "@/constants/routes"

import { IPostWithTableOfContents } from "@/types/blog"
import { cn } from "@/lib/utils"
import Aside from "@/components/pages/aside"
import BackToTop from "@/components/pages/back-to-top"
import Content from "@/components/pages/content"
import SocialShare from "@/components/pages/social-share"
import TableOfContents from "@/components/pages/table-of-contents"

import PostHeader from "./post-header"

interface IPostProps {
  className?: string
  post: IPostWithTableOfContents
  backLink: {
    label: string
    href: string | URL
  }
}

function Post({ className, post, backLink }: IPostProps) {
  return (
    <section className={cn("post", className)}>
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <article className="grid w-full grid-cols-1 gap-y-10 md:gap-y-16 lg:grid-cols-[auto_16rem] lg:gap-y-20 xl:grid-cols-[16rem_auto_16rem]">
          <PostHeader
            className="col-start-1 row-start-1 w-full max-w-176 xl:col-start-2"
            post={post}
            backLink={backLink}
          />
          <div className="col-start-1 row-start-2 max-w-176 xl:col-start-2">
            {/* TODO: Think about how to make mt-0 without the ! */}
            <Content
              className="[&>*:first-child]:mt-0!"
              content={post.content}
            />
          </div>

          <Aside
            className="col-start-2 row-start-2 hidden w-full shrink-0 flex-col pl-16 lg:flex xl:col-start-3"
            sticky
          >
            <TableOfContents
              className="mt-1.5"
              title="On this page"
              items={post.tableOfContents}
            />
            <BackToTop withSeparator />
            <SocialShare
              className="mt-7"
              pathname={`${ROUTE.blog}/${post.slug.current}`}
            />
          </Aside>
        </article>
      </div>
    </section>
  )
}

export default Post
