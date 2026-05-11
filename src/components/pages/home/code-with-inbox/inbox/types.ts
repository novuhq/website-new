import { type ComponentType, type SVGProps } from "react"

export type InboxTheme =
  | "novuDark"
  | "novuLight"
  | "notionDark"
  | "notionLight"
  | "linearDark"
  | "linearLight"

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

// Novu message
export interface INovuMessage {
  category: string
  title: string
  mail?: string
  text: string
  date: string
  isRead: boolean
  avatar?: string
  buttons?: string[]
  index: number
  isArchived: boolean
}

// Notion message
export interface INotionMessage {
  title: string
  subtitle: string
  text: string
  date: string
  isRead: boolean
  authors: { name: string; avatar: string }[]
  index: number
  isArchived: boolean
}

// Linear message
export interface ILinearMessage {
  title: string
  actionType: string
  avatarIcon: IconComponent
  additionalText: string
  date: string
  dateIcon: string
  isRead: boolean
  authors: { name: string; avatar: string }[]
  index: number
  isArchived: boolean
}

export type InboxMessage = INovuMessage | INotionMessage | ILinearMessage

// Raw data types (before index/isArchived are added)
export interface INovuMessageData {
  category: string
  title: string
  mail?: string
  text: string
  date: string
  isRead: boolean
  avatar?: string
  buttons?: string[]
}

export interface INotionMessageData {
  title: string
  subtitle: string
  text: string
  date: string
  isRead: boolean
  authors: { name: string; avatar: string }[]
}

export interface ILinearMessageData {
  title: string
  actionType: string
  avatarIcon: IconComponent
  additionalText: string
  date: string
  dateIcon: string
  isRead: boolean
  authors: { name: string; avatar: string }[]
}

export type InboxMessageData =
  | INovuMessageData
  | INotionMessageData
  | ILinearMessageData

export interface IInboxEntry {
  theme: InboxTheme
  title: string
  categories?: string[]
  messages: InboxMessageData[]
}

export interface ITabItem {
  label: string
  count: number
}

export interface IFilterItem {
  label: string
  Icon: IconComponent
  filter: (messages: InboxMessage[]) => InboxMessage[]
}

export interface IActionItem {
  label: string
  Icon: IconComponent
  action: (messages: InboxMessage[]) => InboxMessage[]
}
