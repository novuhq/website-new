import { type ReactNode } from "react"
import { COLORS } from "@/constants/colors"
import { type PortableTextBlock } from "@portabletext/react"
import { type TableValue } from "@sanity/table"

import {
  IYouTubeEmbed,
  type IAdmonition,
  type ICodeBlock,
  type IDetailsToggle,
  type IVideo,
  type TTableTheme,
} from "@/types/common"
import { type ISanityImageWithAsset } from "@/types/sanity"

export interface IContentPicture extends ISanityImageWithAsset {
  alt?: string
  caption?: string
  variant?: "default" | "outline"
}

export type IContentTable = {
  type: "withTopHeader" | "withoutHeader"
  table: TableValue
  theme?: TTableTheme
}

export interface IContentYouTube extends Omit<IYouTubeEmbed, "cover"> {
  variant?: "default" | "outline"
  cover: ISanityImageWithAsset
}

export interface IContentNote extends Omit<IAdmonition, "children"> {
  content: PortableTextBlock
}

export interface IContentCode extends ICodeBlock {
  children?: ReactNode
}

export interface IContentCodeTabs {
  tabs: ICodeBlock[]
}

export interface IContentVideo extends IVideo {
  variant?: "default" | "outline"
  videoFile: {
    asset: {
      _ref: string
      url: string
    }
  }
}

export interface IContentBlockProps<T> {
  value: T
}

export interface IContentStep {
  title: string
  content: PortableTextBlock
}

export interface IContentDetailsToggle
  extends Omit<IDetailsToggle, "children"> {
  content: PortableTextBlock
}

export interface IContentIframeBlock {
  content: string
}

export interface IContentChangeItem {
  tag?: string
  color?: keyof typeof COLORS
  text: PortableTextBlock[]
}

export interface IContentChangeBlock {
  type: "improvements" | "fixes"
  items: IContentChangeItem[]
}
