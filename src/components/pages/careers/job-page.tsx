import {
  type ICareerJobContentBlock,
  type ICareerJobDetail,
} from "@/types/careers"
import { Link } from "@/components/ui/link"
import DynamicIcon from "@/components/dynamic-icon"

import CareersInterestForm from "./interest-form"

interface CareerJobPageProps {
  job: ICareerJobDetail
}

function CareerJobContent({ content }: { content: ICareerJobContentBlock[] }) {
  return (
    <div className="space-y-4 text-base leading-normal tracking-tighter text-gray-8">
      {content.map((block, index) => {
        if (block._type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3"

          return (
            <Tag
              key={index}
              className="mt-12 mb-5 text-[1.5rem] leading-snug font-medium tracking-tighter text-white first:mt-0"
            >
              {block.text}
            </Tag>
          )
        }

        if (block._type === "bulletedList") {
          return (
            <ul key={index} className="my-5 flex flex-col gap-y-4">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="relative pl-5">
                  <span
                    className="absolute top-3 left-0 h-px w-2 rounded-full bg-secondary-foreground"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          )
        }

        return <p key={index}>{block.text}</p>
      })}
    </div>
  )
}

function CareerJobPage({ job }: CareerJobPageProps) {
  const breadcrumbs = ["Careers", job.department]

  return (
    <main className="px-5 pt-20 pb-32 md:px-8 md:pt-28 lg:pt-34 lg:pb-40">
      <article className="mx-auto grid max-w-304 gap-12 lg:grid-cols-[minmax(18rem,28rem)_minmax(0,44rem)] lg:gap-x-16">
        <aside className="lg:sticky lg:top-31 lg:self-start">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2.5">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center gap-x-2.5">
                  {index > 0 && (
                    <span className="text-sm leading-none font-medium tracking-tight text-gray-7">
                      /
                    </span>
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span
                      aria-current="page"
                      className="text-sm leading-none tracking-tighter text-lagune-2"
                    >
                      {item}
                    </span>
                  ) : (
                    <Link
                      className="text-sm leading-none tracking-tighter text-gray-7"
                      href={"/careers"}
                      variant="muted-dark"
                      size="sm"
                    >
                      {index === 0 && <DynamicIcon icon="chevron-left" />}
                      {item}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="mt-5 text-4xl leading-dense font-medium tracking-tighter text-white md:max-w-112 md:text-5xl lg:text-[2.5rem]">
            {job.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-base leading-normal tracking-tighter text-gray-8 md:text-lg">
            <span>{job.location}</span>
            <span className="size-1.5 rounded-full bg-gray-5" aria-hidden />
            <span>{job.workplaceType}</span>
            <span className="size-1.5 rounded-full bg-gray-5" aria-hidden />
            <span>{job.hours}</span>
          </div>
          <a
            className="mt-9 inline-flex h-9.5 items-center justify-center rounded-sm bg-white px-5 text-xs leading-none font-medium tracking-normal text-black uppercase transition-colors duration-300 hover:bg-secondary-foreground"
            href="#apply"
          >
            Apply now
          </a>
        </aside>

        <div className="min-w-0">
          <CareerJobContent content={job.content} />
          <section
            id="apply"
            className="mt-14 scroll-mt-24"
            aria-labelledby="apply-heading"
          >
            <h2
              id="apply-heading"
              className="text-[1.5rem] leading-snug font-medium tracking-tighter text-white"
            >
              Apply for This Position
            </h2>
            <CareersInterestForm defaultDepartment={job.department} />
          </section>
        </div>
      </article>
    </main>
  )
}

export default CareerJobPage
