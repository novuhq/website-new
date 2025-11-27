import { ReactNode } from "react"
import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import config from "@/configs/website-config"
import {
  PortableText,
  PortableTextBlock,
  PortableTextBlockComponent,
  PortableTextComponentProps,
  PortableTextReactComponents,
} from "@portabletext/react"

import { ICodeBlock, type IBlockquote } from "@/types/common"
import {
  IContentTabs,
  type IContentCodeTabs,
  type IContentDetailsToggle,
  type IContentNote,
  type IContentPicture,
  type IContentTable,
  type IContentVideo,
  type IContentYouTube,
} from "@/types/content"
import { getProcessedImageUrl } from "@/lib/sanity/utils/get-url-for-image"
import {
  cn,
  extractTextFromChildren,
  extractYouTubeId,
  generateHeadingSlug,
} from "@/lib/utils"
import Admonition from "@/components/content/admonition"
import Blockquote from "@/components/content/blockquote"
import CodeBlock from "@/components/content/code-block"
import CodeTabs from "@/components/content/code-tabs"
import Details from "@/components/content/details"
import Heading from "@/components/content/heading"
import Picture from "@/components/content/picture"
import Table from "@/components/content/table"
import Video from "@/components/content/video"
import YouTubeEmbed from "@/components/content/youtube-embed"

import { Tab, Tabs } from "../content/tabs"

function getComponents(
  uniqueHeadingMap: Record<string, number>,
  allowMediaBreakout: boolean
): Partial<PortableTextReactComponents> {
  return {
    types: {
      image: ({
        value: { asset, alt, caption, variant = "default" },
      }: PortableTextComponentProps<IContentPicture>) => {
        const baseWidth = config.blog.postContentWidth
        const outlineAdjustment = variant === "outline" ? -16 : 0
        const mediaBreakoutAdjustment = allowMediaBreakout ? 128 : 0
        const renderWidth =
          baseWidth + outlineAdjustment + mediaBreakoutAdjustment

        const imageSize = asset._ref.split("-")[2]
        const [width, height] = imageSize.split("x").map(Number)
        const imageHeight = Math.ceil((renderWidth * height) / width)
        const imageUrl = getProcessedImageUrl(asset, {
          width: renderWidth,
          height: imageHeight,
          quality: 95,
          isSVG: false,
        })

        if (!imageUrl) return null

        return (
          <Picture
            className={allowMediaBreakout ? "lg:-mx-16" : ""}
            src={imageUrl}
            alt={alt ?? ""}
            width={renderWidth}
            height={imageHeight}
            caption={caption}
            variant={variant}
          />
        )
      },
      codeBlock: ({ value }: PortableTextComponentProps<ICodeBlock>) => {
        return <CodeBlock className="my-8" {...value} />
      },
      codeTabs: ({
        value: { tabs },
      }: PortableTextComponentProps<IContentCodeTabs>) => {
        return <CodeTabs className="my-8" tabs={tabs} />
      },
      tableBlock: ({
        value: { table, type, theme = "outline" },
      }: PortableTextComponentProps<IContentTable>) => (
        <Table table={table} type={type} theme={theme} />
      ),
      noteBlock: ({
        value: { content, title },
      }: PortableTextComponentProps<IContentNote>) => (
        <Admonition title={title}>
          <PortableContent content={content} />
        </Admonition>
      ),
      tabsBlock: ({
        value: { tabs },
      }: PortableTextComponentProps<IContentTabs>) => {
        const labels = tabs.map((tab) => tab.label)

        return (
          <Tabs labels={labels}>
            {tabs.map((tab) => (
              <Tab key={tab.label} label={tab.label}>
                <PortableContent content={tab.content} />
              </Tab>
            ))}
          </Tabs>
        )
      },
      detailsToggleBlock: ({
        value: { title, content },
      }: PortableTextComponentProps<IContentDetailsToggle>) => (
        <Details title={title}>
          <PortableContent content={content} />
        </Details>
      ),
      quoteBlock: ({
        value: { quote, role, authors },
      }: PortableTextComponentProps<IBlockquote>) => (
        <Blockquote
          className="my-8"
          quote={quote}
          role={role}
          authors={authors}
          size="xs"
          theme="border"
        />
      ),
      youtubeVideo: ({
        value: { youtubeId, cover, variant = "default" },
      }: PortableTextComponentProps<IContentYouTube>) => {
        const id = extractYouTubeId(youtubeId)

        if (!id) {
          return null
        }
        const baseWidth = config.blog.postContentWidth
        const outlineAdjustment = variant === "outline" ? -16 : 0
        const mediaBreakoutAdjustment = allowMediaBreakout ? 128 : 0
        const renderWidth =
          baseWidth + outlineAdjustment + mediaBreakoutAdjustment

        const previewCover =
          getProcessedImageUrl(cover, {
            width: renderWidth,
            height: Math.ceil(renderWidth / config.blog.coverAspectRatio),
            quality: 95,
            isSVG: false,
          }) || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`

        return (
          <YouTubeEmbed
            className={cn(
              "my-8 rounded-lg",
              allowMediaBreakout ? "lg:-mx-16" : ""
            )}
            youtubeId={id}
            width={renderWidth}
            height={Math.ceil(renderWidth / config.blog.coverAspectRatio)}
            variant={variant}
          >
            <Image
              className="w-full rounded-lg"
              src={previewCover}
              alt=""
              width={renderWidth}
              height={Math.ceil(renderWidth / config.blog.coverAspectRatio)}
            />
          </YouTubeEmbed>
        )
      },
      video: ({
        value: {
          videoFile,
          alt,
          poster,
          autoplay,
          controls,
          muted,
          loop,
          variant = "default",
        },
      }: PortableTextComponentProps<IContentVideo>) => {
        if (!videoFile?.asset?._ref) {
          return null
        }
        const baseWidth = config.blog.postContentWidth
        const outlineAdjustment = variant === "outline" ? -16 : 0
        const mediaBreakoutAdjustment = allowMediaBreakout ? 128 : 0
        const renderWidth =
          baseWidth + outlineAdjustment + mediaBreakoutAdjustment

        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
        const videoRef = videoFile.asset._ref
        const videoUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${videoRef.replace("file-", "").replace("-mp4", ".mp4").replace("-webm", ".webm")}`

        const aspectRatio = 1408 / 1056
        const videoHeight = Math.ceil(renderWidth / aspectRatio)

        const posterUrl = poster
          ? getProcessedImageUrl(poster, {
              width: config.blog.postContentWidth,
              height: Math.ceil(
                config.blog.postContentWidth / config.blog.coverAspectRatio
              ),
              quality: 95,
              isSVG: false,
            }) || undefined
          : undefined

        return (
          <Video
            className={allowMediaBreakout ? "lg:-mx-16" : ""}
            src={videoUrl}
            alt={alt}
            width={renderWidth}
            height={videoHeight}
            poster={posterUrl}
            autoplay={autoplay}
            controls={controls}
            muted={muted}
            loop={loop}
            variant={variant}
          />
        )
      },
    },
    block: {
      h2: ({ children }: { children: ReactNode }) => {
        const id = generateHeadingSlug(
          extractTextFromChildren(children),
          uniqueHeadingMap
        )
        return (
          <Heading tag="h2" id={id}>
            {children}
          </Heading>
        )
      },
      h3: ({ children }: { children: ReactNode }) => {
        const id = generateHeadingSlug(
          extractTextFromChildren(children),
          uniqueHeadingMap
        )
        return (
          <Heading tag="h3" id={id}>
            {children}
          </Heading>
        )
      },
    } as unknown as PortableTextBlockComponent,
    marks: {
      link: ({ value, children }) => (
        <Link
          href={value.href as Route<string>}
          target={value.isExternal ? "_blank" : undefined}
          rel={value.isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </Link>
      ),
    },
  }
}

interface IPortableContentProps {
  className?: string
  content: PortableTextBlock[] | PortableTextBlock
  allowMediaBreakout?: boolean
}

function PortableContent({
  className,
  content,
  allowMediaBreakout = false,
}: IPortableContentProps) {
  const uniqueHeadingMap = {}
  const components = getComponents(uniqueHeadingMap, allowMediaBreakout)

  return (
    <div className={cn("content prose prose-lg max-w-none", className)}>
      <PortableText<PortableTextBlock>
        value={content}
        components={components}
      />
    </div>
  )
}

export default PortableContent
