import GetStarted from "@/components/pages/get-started"

import Benefits from "./benefits"
import UseCaseHero from "./child-hero"
import UseCaseFeatures from "./features"
import PainRestatement from "./pain-restatement"
import type { UseCasePageData } from "./types"

interface UseCasePageProps {
  data: UseCasePageData
}

function UseCasePage({ data }: UseCasePageProps) {
  return (
    <div className="-mt-16 overflow-hidden bg-background">
      <UseCaseHero data={data.hero} />
      <UseCaseFeatures features={data.features} slug={data.slug} />
      <PainRestatement data={data.painRestatement} />
      <Benefits data={data.benefits} />
      <GetStarted />
    </div>
  )
}

export default UseCasePage
