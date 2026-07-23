export interface ITemplateImage {
  url: string
  width: number
  height: number
  alt?: string
}

export interface ITemplateCategoryData {
  id: string
  title: string
  description?: string
}

export interface ITemplateReferenceData {
  id: string
  name: string
  description?: string
}

export interface ITemplateIconReferenceData extends ITemplateReferenceData {
  icon: ITemplateImage
}

export interface ITemplateMcpServerData extends ITemplateIconReferenceData {
  url?: string
}

export interface ITemplateChannelData extends ITemplateIconReferenceData {
  isComingSoon: boolean
}

export interface ITemplateAvatarData {
  id: string
  name: string
  darkImage: ITemplateImage
  lightImage: ITemplateImage
}

export type ITemplateToolData = ITemplateReferenceData

export interface IAgentTemplateData {
  _id: string
  _createdAt: string
  id: string
  name: string
  agentName: string
  summary: string
  avatar: ITemplateAvatarData
  category: ITemplateCategoryData
  mcpServerList: ITemplateMcpServerData[]
  channels: ITemplateChannelData[]
  skillsList: string[]
  tools: ITemplateToolData[]
  systemPrompt: string
}

export interface IAgentTemplatesSectionData {
  categories: ITemplateCategoryData[]
  templates: IAgentTemplateData[]
}

export interface IAgentTemplateSignupPayload {
  id: string
  avatar: string
  category: string
  mcpServerList: string[]
  channels: string[]
  skillsList: string[]
  tools: string[]
  systemPrompt: string
}
