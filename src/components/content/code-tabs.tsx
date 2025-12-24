import { Children, isValidElement, ReactElement, ReactNode } from "react"

import { type ICodeBlock } from "@/types/common"
import { TabsContent } from "@/components/ui/tabs"

import CodeBlock from "./code-block"
import CodeTabsWrapper from "./code-tabs-wrapper"

interface ICodeTabsProps {
  tabs?: ICodeBlock[]
  className?: string
  children?: ReactNode
}

interface IInnerCodeElementProps {
  className: string
  children: string
  fileName?: string
}

interface IOuterElementProps {
  children: ReactElement<IInnerCodeElementProps>
}

const extractCodeBlocks = (childrenArray: ReactNode[]): ICodeBlock[] => {
  return childrenArray
    .map((child) => {
      if (
        isValidElement<IOuterElementProps>(child) &&
        isValidElement<IInnerCodeElementProps>(child.props.children) &&
        child.props.children.props.className
      ) {
        const langClass = child.props.children.props.className
        const code = child.props.children.props.children
        const lang = langClass.replace("code-block-", "")
        const fileName = child.props.children.props.fileName
        return { language: lang, code, fileName }
      }
      return null
    })
    .filter(Boolean) as ICodeBlock[]
}

function CodeTabs({ tabs, className, children }: ICodeTabsProps) {
  if (!tabs && !children) return null

  const childrenArray = Children.toArray(children)
  const resolvedTabs = tabs || extractCodeBlocks(childrenArray)
  const resolvedLabels = resolvedTabs.map((tab) => tab.language)

  return (
    <CodeTabsWrapper className={className} labels={resolvedLabels}>
      {resolvedTabs.map((tab) => (
        <TabsContent className="my-0" key={tab.language} value={tab.language}>
          <CodeBlock
            className="border-none"
            as="div"
            language={tab.language}
            code={tab.code}
          />
        </TabsContent>
      ))}
    </CodeTabsWrapper>
  )
}

export default CodeTabs
