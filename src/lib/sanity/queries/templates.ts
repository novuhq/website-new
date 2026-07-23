import { groq } from "next-sanity"

const imageFields = `
  "url": asset->url + "?auto=format",
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "alt": alt
`

const templateCategoryFields = `
  "id": slug.current,
  title,
  description
`

const templateReferenceFields = `
  "id": slug.current,
  name,
  description
`

const templateChannelFields = `
  ${templateReferenceFields},
  "isComingSoon": isComingSoon == true,
  "icon": icon {
    ${imageFields}
  }
`

const templateIconReferenceFields = `
  ${templateReferenceFields},
  "icon": icon {
    ${imageFields}
  }
`

const templateMcpServerFields = `
  ${templateIconReferenceFields},
  url
`

const templateAvatarFields = `
  "id": slug.current,
  name,
  "darkImage": darkImage {
    ${imageFields}
  },
  "lightImage": lightImage {
    ${imageFields}
  }
`

const agentTemplateFields = `
  _id,
  _createdAt,
  "id": id.current,
  name,
  agentName,
  summary,
  avatar->{
    ${templateAvatarFields}
  },
  category->{
    ${templateCategoryFields}
  },
  mcpServerList[]->{
    ${templateMcpServerFields}
  },
  channels[]->{
    ${templateChannelFields}
  },
  "skillsList": skillsList[]{
    "value": select(defined(_ref) => @->slug.current, @)
  }.value,
  "tools": coalesce(tools[]->{
    ${templateReferenceFields}
  }, []),
  systemPrompt
`

export const agentTemplatesQuery = groq`
  *[_type == "agentTemplate"] | order(category->orderRank asc, name asc) {
    ${agentTemplateFields}
  }
`

export const agentTemplatesSectionQuery = groq`
  {
    "categories": *[_type == "templateCategory"] | order(orderRank asc) {
      ${templateCategoryFields}
    },
    "templates": *[_type == "agentTemplate"] | order(category->orderRank asc, name asc) {
      ${agentTemplateFields}
    }
  }
`

export const agentTemplateByIdQuery = groq`
  *[_type == "agentTemplate" && id.current == $id][0] {
    ${agentTemplateFields}
  }
`

export const templateCategoriesQuery = groq`
  *[_type == "templateCategory"] | order(orderRank asc) {
    ${templateCategoryFields}
  }
`

export const templateAvatarsQuery = groq`
  *[_type == "templateAvatar"] | order(orderRank asc) {
    ${templateAvatarFields}
  }
`

export const agentTemplateSignupPayloadByIdQuery = groq`
  *[_type == "agentTemplate" && id.current == $id][0] {
    "id": id.current,
    "avatar": avatar->slug.current,
    "category": category->slug.current,
    "mcpServerList": mcpServerList[]->slug.current,
    "channels": channels[]->slug.current,
    "skillsList": skillsList[]{
      "value": select(defined(_ref) => @->slug.current, @)
    }.value,
    "tools": coalesce(tools[]->slug.current, []),
    systemPrompt
  }
`
