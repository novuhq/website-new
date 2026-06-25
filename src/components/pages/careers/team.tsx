import Image, { type StaticImageData } from "next/image"
import image1 from "@/images/pages/careers/team/1.jpg"
import image2 from "@/images/pages/careers/team/2.jpg"
import image3 from "@/images/pages/careers/team/3.jpg"
import image4 from "@/images/pages/careers/team/4.jpg"

import { cn } from "@/lib/utils"

const stats = [
  { value: "2021", label: "Year founded" },
  { value: "$6.6M", label: "Total funding" },
  { value: "~30", label: "Team members" },
  { value: "150+", label: "Customers" },
]

function TeamImage({
  src,
  className,
}: {
  src: StaticImageData
  className: string
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[12px]", className)}>
      <Image
        src={src}
        className="size-full object-cover"
        sizes="(max-width: 768px) 100vw, 468px"
        alt=""
      />
      <div className="absolute inset-0 bg-[#944ECC33]" aria-hidden />
    </div>
  )
}

function CareersTeam() {
  return (
    <section className="px-5 pb-30 md:px-8 md:pb-40 lg:pb-40">
      <div className="mx-auto max-w-240">
        <div className="mx-auto max-w-160 text-center">
          <h2 className="text-[2.5rem] leading-dense font-medium tracking-tighter text-white md:text-[3.25rem]">
            Meet the Novu team
          </h2>
          <p className="mt-4 text-lg leading-normal tracking-tighter text-gray-8">
            We are cat lovers, croissant bakers, wine sommeliers, taco eaters,
            and more. Bring your whole authentic self to work alongside us.
          </p>
        </div>

        <div className="mt-11 grid gap-6 md:grid-cols-2">
          <div className="grid gap-6">
            <TeamImage src={image1} className="aspect-[468/303]" />
            <TeamImage src={image3} className="aspect-square" />
          </div>
          <div className="grid gap-6">
            <TeamImage src={image2} className="aspect-square" />
            <TeamImage src={image4} className="aspect-[468/303]" />
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4 md:gap-x-29.5">
          {stats.map((stat) => (
            <div key={stat.label} className="">
              <dd className="mb-1.5 text-[2.75rem] leading-none tracking-tighter text-white">
                {stat.value}
              </dd>
              <dt className="text-[1.125rem] leading-normal font-light tracking-tighter text-gray-8">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default CareersTeam
