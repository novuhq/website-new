import changeBlock from "./change-block"
import codeBlock from "./code-block"
import codeTabs from "./code-tabs"
import content from "./content"
import detailsToggleBlock from "./details-toggle-block"
import dividerBlock from "./divider"
import iframeBlock from "./iframe-block"
import noteBlock from "./note-block"
import quoteBlock from "./quote-block"
import staticContent from "./static-content"
import stepBlock from "./steps-block"
import tableBlock from "./table-block"
import twitterEmbed from "./twitter-embed"
import video from "./video"
import youtubeVideo from "./youtube-video"

const CONTENT_TYPES = [
  content,
  detailsToggleBlock,
  tableBlock,
  changeBlock,
  dividerBlock,
  youtubeVideo,
  video,
  quoteBlock,
  codeBlock,
  noteBlock,
  iframeBlock,
  twitterEmbed,
  staticContent,
  ...codeTabs,
  ...stepBlock,
]

export default CONTENT_TYPES
