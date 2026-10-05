import Image from "next/image"

import type { DirectoryPost as DirectoryPostData } from "@/lib/directory"
import ZoomIllustration from "@/components/ui/zoom-illustration"

import DirectoryBreadcrumb from "./directory-breadcrumb"
import DirectoryGallery from "./directory-gallery"
import DirectoryPostsList from "./directory-posts-list"
import DirectorySidebar from "./directory-sidebar"
import { getDirectoryMdxComponents } from "./mdx-components"

interface DirectoryPostProps {
  post: DirectoryPostData
  relatedPosts: DirectoryPostData[]
}

export default function DirectoryPost({
  post,
  relatedPosts,
}: DirectoryPostProps) {
  const { Content } = post
  const isGallery = post.images.length > 1
  const cover = post.images[0]

  return (
    <>
      <article className="-mt-16 overflow-hidden bg-[#05050b] pt-[103px] pb-28 md:pt-[110px] lg:pt-[119px] lg:pb-[127px] xl:pt-[127px]">
        <header className="relative mx-auto grid w-full max-w-304 grid-cols-1 items-start px-4 md:px-7 lg:grid-cols-[704px_minmax(0,1fr)] lg:gap-x-16 lg:px-8 xl:grid-cols-[minmax(0,1fr)_704px_minmax(0,1fr)] xl:px-10 2xl:px-0">
          <div className="lg:col-start-1 xl:col-start-2">
            <DirectoryBreadcrumb pathname={post.pathname} title={post.title} />
            <h1 className="mt-4 text-[36px] leading-[1.125] font-medium tracking-tighter md:text-[44px] lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-2.5 text-lg leading-normal font-book tracking-tighter text-gray-8 md:mt-4">
              {post.description}
            </p>
          </div>
        </header>

        {isGallery ? (
          <DirectoryGallery images={post.images} title={post.title} />
        ) : (
          <div className="relative mx-auto grid w-full max-w-304 grid-cols-1 px-4 md:px-7 lg:grid-cols-[704px_minmax(0,1fr)] lg:gap-x-16 lg:px-8 xl:grid-cols-[minmax(0,1fr)_704px_minmax(0,1fr)] xl:px-10 2xl:px-0">
            <div className="mt-8 overflow-hidden rounded-[10px] lg:col-start-1 xl:col-start-2">
              <ZoomIllustration src={cover.src}>
                <Image
                  className="aspect-video w-full rounded-[10px] object-cover object-center"
                  src={cover.src}
                  alt={cover.alt}
                  width={cover.width}
                  height={cover.height}
                  priority
                  quality={90}
                  sizes="(max-width: 1023px) calc(100vw - 32px), 704px"
                />
              </ZoomIllustration>
            </div>
          </div>
        )}

        <div className="relative mx-auto grid w-full max-w-304 grid-cols-1 items-start px-4 md:px-7 lg:grid-cols-[704px_minmax(0,1fr)] lg:gap-x-16 lg:px-8 xl:grid-cols-[minmax(0,1fr)_704px_minmax(0,1fr)] xl:px-10 2xl:px-0">
          <div className="mt-10 mb-6 min-w-0 md:mt-12 lg:col-start-1 xl:col-start-2">
            <Content components={getDirectoryMdxComponents()} />
          </div>
          <DirectorySidebar post={post} />
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section
          className="mx-auto mb-28 w-full max-w-240 px-4 md:px-7 lg:mb-32"
          aria-labelledby="related-directory-heading"
        >
          <h2
            className="text-center text-[32px] leading-[1.125] font-medium tracking-tighter md:text-4xl lg:text-[44px]"
            id="related-directory-heading"
          >
            Check out more
          </h2>
          <DirectoryPostsList
            className="mt-10 lg:mt-[54px] xl:mt-12"
            headingLevel={3}
            posts={relatedPosts}
          />
        </section>
      )}
    </>
  )
}
