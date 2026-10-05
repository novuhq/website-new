import GoalCards from "./goal-cards"
import IndexCta from "./index-cta"
import {
  INDEX_ECHO_CTA,
  INDEX_GOALS,
  INDEX_HERO,
  INDEX_PICTURE_SECTIONS,
  INDEX_REQUIREMENTS_CTA,
} from "./index-data"
import IndexPictureSection from "./index-picture-section"

function UseCasesIndexPage() {
  return (
    <div className="-mt-16 overflow-hidden bg-background pt-16">
      <h1 className="sr-only">Use Cases</h1>
      <IndexPictureSection data={INDEX_HERO} />
      <GoalCards {...INDEX_GOALS} />
      <IndexCta data={INDEX_ECHO_CTA} variant="echo" />
      {INDEX_PICTURE_SECTIONS.map((section) => (
        <IndexPictureSection key={section.id} data={section} />
      ))}
      <IndexCta data={INDEX_REQUIREMENTS_CTA} variant="requirements" />
    </div>
  )
}

export default UseCasesIndexPage
