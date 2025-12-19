import { ReactNode } from "react"
import { Route } from "next"
import Image from "next/image"
import {
  PortableText,
  PortableTextComponentProps,
  PortableTextReactComponents,
  type PortableTextBlock,
  type PortableTextBlockComponent,
} from "@portabletext/react"
import { ChevronRight } from "lucide-react"
import { Tweet } from "react-tweet"

import { IBlockquote } from "@/types/common"
import {
  IContentChangeBlock,
  IContentCode,
  IContentCodeTabs,
  IContentCtaBlock,
  IContentDetailsToggle,
  IContentIframeBlock,
  IContentNote,
  IContentPicture,
  IContentStep,
  IContentTable,
  IContentVideo,
  IContentYouTube,
} from "@/types/content"
import { getProcessedImageUrl } from "@/lib/sanity/utils/get-url-for-image"
import {
  cn,
  extractTextFromChildren,
  extractYouTubeId,
  generateHeadingSlug,
} from "@/lib/utils"
import { Link } from "@/components/ui/link"
import ZoomIllustration from "@/components/ui/zoom-illustration"
import Admonition from "@/components/content/admonition"
import Blockquote from "@/components/content/blockquote"
import ChangeBlock from "@/components/content/change-block"
import CodeBlock from "@/components/content/code-block"
import CodeTabs from "@/components/content/code-tabs"
import Cta from "@/components/content/cta"
import Details from "@/components/content/details"
import Heading from "@/components/content/heading"
import Picture from "@/components/content/picture"
import { Step, Steps } from "@/components/content/steps"
import Table from "@/components/content/table"
import Video from "@/components/content/video"
import YouTubeEmbed from "@/components/content/youtube-embed"

function getComponents(
  uniqueHeadingMap: Record<string, number>,
  allowMediaBreakout: boolean,
  readMoreSlug: string
): Partial<PortableTextReactComponents> {
  return {
    types: {
      dividerBlock: () => {
        return (
          <>
            <Link
              className="hidden-start !no-underline"
              href={readMoreSlug}
              animation="arrow-right"
            >
              Read more
              <ChevronRight className="translate-y-0.5" size={16} />
            </Link>
          </>
        )
      },
      image: ({
        value: { asset, alt, caption, variant = "default" },
      }: PortableTextComponentProps<IContentPicture>) => {
        const baseWidth = 704
        const outlineAdjustment = variant === "outline" ? -16 : 0
        const mediaBreakoutAdjustment = allowMediaBreakout ? 128 : 0
        const renderWidth =
          baseWidth + outlineAdjustment + mediaBreakoutAdjustment

        const imageSize = asset._ref.split("-")[2]
        const [width, height] = imageSize.split("x").map(Number)
        const imageHeight = Math.ceil((renderWidth * height) / width)
        const isGif = asset._ref.endsWith("-gif")
        const imageUrl = getProcessedImageUrl(asset, {
          width: renderWidth,
          height: imageHeight,
          quality: 95,
          isSVG: false,
          isGif,
        })

        if (!imageUrl) {
          return null
        }

        return (
          <ZoomIllustration src={imageUrl} originalAsset={asset}>
            <Picture
              className={allowMediaBreakout ? "lg:-mx-16" : ""}
              src={imageUrl}
              alt={alt ?? ""}
              width={renderWidth}
              height={imageHeight}
              caption={caption}
              variant={variant}
            />
          </ZoomIllustration>
        )
      },
      ctaBlock: ({ value }: PortableTextComponentProps<IContentCtaBlock>) => (
        <Cta {...value} />
      ),
      quoteBlock: ({
        value: { quote, role, authors },
      }: PortableTextComponentProps<IBlockquote>) => (
        <Blockquote
          className="my-6.5"
          quote={quote}
          role={role}
          authors={authors}
          theme="border"
          size="xs"
        />
      ),
      noteBlock: ({
        value: { content, title },
      }: PortableTextComponentProps<IContentNote>) => (
        <Admonition title={title}>
          <Content content={content} />
        </Admonition>
      ),
      detailsToggleBlock: ({
        value: { title, content },
      }: PortableTextComponentProps<IContentDetailsToggle>) => (
        <Details title={title}>
          <Content content={content} />
        </Details>
      ),
      tableBlock: ({
        value: { table, type, theme = "outline" },
      }: PortableTextComponentProps<IContentTable>) => (
        <Table table={table} type={type} theme={theme} />
      ),
      stepsBlock: ({
        value: { steps },
      }: PortableTextComponentProps<{ steps: IContentStep[] }>) => (
        <Steps>
          {steps.map(({ title, content }, index) => (
            <Step key={index} title={title} number={index + 1}>
              <Content content={content} />
            </Step>
          ))}
        </Steps>
      ),
      codeBlock: ({ value }: PortableTextComponentProps<IContentCode>) => {
        return <CodeBlock className="my-8" {...value} />
      },
      codeTabs: ({ value }: PortableTextComponentProps<IContentCodeTabs>) => {
        return <CodeTabs className="numbered-lines my-8" tabs={value.tabs} />
      },
      youtubeVideo: ({
        value: { youtubeId, cover, variant = "default" },
      }: PortableTextComponentProps<IContentYouTube>) => {
        const id = extractYouTubeId(youtubeId)

        if (!id) {
          return null
        }
        const baseWidth = 704
        const outlineAdjustment = variant === "outline" ? -16 : 0
        const mediaBreakoutAdjustment = allowMediaBreakout ? 128 : 0
        const renderWidth =
          baseWidth + outlineAdjustment + mediaBreakoutAdjustment

        const previewCover =
          getProcessedImageUrl(cover, {
            width: renderWidth,
            height: Math.ceil(renderWidth / 1.777),
            quality: 95,
            isSVG: false,
          }) || `https://img.youtube.com/vi/${id}/hqdefault.jpg`

        return (
          <YouTubeEmbed
            className={cn(
              "my-5.5 rounded-lg",
              allowMediaBreakout ? "lg:-mx-16" : ""
            )}
            youtubeId={id}
            width={renderWidth}
            height={Math.ceil(renderWidth / 1.777)}
            variant={variant}
          >
            <Image
              className="aspect-video h-auto w-full rounded-lg object-cover"
              src={previewCover}
              alt=""
              width={renderWidth}
              height={Math.ceil(renderWidth / 1.777)}
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
        const baseWidth = 704
        const outlineAdjustment = variant === "outline" ? -16 : 0
        const mediaBreakoutAdjustment = allowMediaBreakout ? 128 : 0
        const renderWidth =
          baseWidth + outlineAdjustment + mediaBreakoutAdjustment

        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
        const videoRef = videoFile.asset._ref
        const videoUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${videoRef
          .replace("file-", "")
          .replace("-mp4", ".mp4")
          .replace("-webm", ".webm")}`

        const aspectRatio = 1408 / 1056
        const videoHeight = Math.ceil(renderWidth / aspectRatio)

        const posterUrl = poster
          ? getProcessedImageUrl(poster, {
              width: 704,
              height: Math.ceil(704 / 16 / 9),
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
      twitterEmbed: ({
        value: { tweetUrl },
      }: {
        value: { tweetUrl: string }
      }) => {
        const getTweetId = (url: string): string => {
          const match = url.match(/\/status\/(\d+)/)

          return match ? match[1] : ""
        }
        const tweetId = getTweetId(tweetUrl)

        return (
          <div className="not-prose flex justify-center" data-theme="dark">
            <Tweet id={tweetId} />
          </div>
        )
      },
      iframeBlock: ({
        value,
      }: PortableTextComponentProps<IContentIframeBlock>) => (
        <div
          className="my-8 sm:my-6 [&_iframe]:w-full"
          dangerouslySetInnerHTML={{ __html: value.content }}
        />
      ),
      changeBlock: ({
        value: { type, items },
      }: PortableTextComponentProps<IContentChangeBlock>) => {
        return <ChangeBlock type={type} items={items} />
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

interface IContentProps {
  className?: string
  content: PortableTextBlock[] | PortableTextBlock
  allowMediaBreakout?: boolean
  readMoreSlug?: string
}

function Content({
  className,
  content,
  allowMediaBreakout = false,
  readMoreSlug = "",
}: IContentProps) {
  const uniqueHeadingMap = {}
  const components = getComponents(
    uniqueHeadingMap,
    allowMediaBreakout,
    readMoreSlug
  )

  return (
    <div className={cn("prose max-w-none", className)}>
      <PortableText value={content} components={components} />
    </div>
  )
}

export default Content
