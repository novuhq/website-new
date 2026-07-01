import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { type ICareerJob } from "@/types/careers"
import { Button } from "@/components/ui/button"

interface CareersOpenRolesProps {
  jobs: ICareerJob[]
}

function CareersOpenRoles({ jobs }: CareersOpenRolesProps) {
  if (!jobs.length) {
    return null
  }

  return (
    <section
      className="scroll-mt-16 px-5 pb-50 md:scroll-mt-28 md:px-8"
      id="apply"
    >
      <div className="mx-auto max-w-240">
        <div className="text-center">
          <h2 className="text-[2.5rem] leading-dense font-medium tracking-tighter text-white md:text-[3.25rem]">
            Open roles
          </h2>
          <p className="mx-auto mt-5 max-w-176 text-lg leading-normal tracking-tighter text-gray-8">
            We&apos;re helping teams deliver the right message, on the right
            channel, at the right time.
          </p>
        </div>

        <ul className="mt-9.5">
          {jobs.map((job, index) => (
            <li
              key={job._id}
              className="border-gray-3 py-7 not-last:border-b first:pt-0"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-[1.5rem] leading-snug font-medium text-white">
                    {job.title}
                  </h3>
                  <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-base leading-none tracking-tighter">
                    <span className="text-lagune-3">{job.department}</span>
                    <span className="text-gray-5" aria-hidden>
                      |
                    </span>
                    <span className="text-gray-8">{job.workplaceType}</span>
                    <span className="text-gray-5" aria-hidden>
                      |
                    </span>
                    <span className="text-gray-8">{job.hours}</span>
                    <span className="text-gray-5" aria-hidden>
                      |
                    </span>
                    <span className="text-gray-8">{job.location}</span>
                  </div>
                </div>

                <Button className="h-8 w-full shrink-0 px-4 md:w-27.25" asChild>
                  <NextLink
                    href={`${ROUTE.careers}/${job.slug}`}
                    data-click-location="careers_open_roles"
                    data-click-text={`view_role_${index + 1}`}
                  >
                    Apply now
                  </NextLink>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default CareersOpenRoles
