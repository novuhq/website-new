import Image, { type StaticImageData } from "next/image"
import gdprIcon from "@/images/pages/connect/compliance/gdpr.svg"
import hipaaIcon from "@/images/pages/connect/compliance/hipaa.svg"
import isoIcon from "@/images/pages/connect/compliance/iso.svg"
import soc2Icon from "@/images/pages/connect/compliance/soc-2.svg"

interface IComplianceItem {
  title: string
  image: StaticImageData
}

const COMPLIANCE_ITEMS: IComplianceItem[] = [
  {
    title: "SOC2 Type II",
    image: soc2Icon,
  },
  {
    title: "HIPAA",
    image: hipaaIcon,
  },
  {
    title: "ISO 27001:2013",
    image: isoIcon,
  },
  {
    title: "GDPR",
    image: gdprIcon,
  },
]

function Compliance() {
  return (
    <section
      className="relative z-10 pt-28 md:pt-36 lg:pt-44 xl:pt-50"
      data-connect-section="compliance"
    >
      <div className="relative mx-auto flex w-full max-w-304 flex-col items-center px-5 text-center md:px-8 2xl:px-0">
        <h2 className="relative z-10 max-w-207.25 text-[1.75rem] leading-dense font-medium tracking-tighter text-balance text-white md:text-[2.5rem] xl:text-[2.75rem]">
          Connect to your work environment without losing your privacy
        </h2>

        <ul className="relative z-10 mt-9 grid w-full max-w-192 grid-cols-1 before:absolute before:inset-x-0 before:top-12.5 before:hidden before:h-px before:bg-[radial-gradient(62.37%_62.37%_at_50%_50%,#534B5D_0%,rgba(83,75,93,0)_100%)] after:absolute after:inset-x-0 after:bottom-12.5 after:hidden after:h-px after:bg-[radial-gradient(62.37%_62.37%_at_50%_50%,#534B5D_0%,rgba(83,75,93,0)_100%)] md:grid-cols-4 md:before:block md:after:block">
          {COMPLIANCE_ITEMS.map((item) => (
            <li
              key={item.title}
              className="relative flex flex-col items-center gap-3 py-8 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[radial-gradient(61.9%_61.9%_at_50%_50%,#534B5D_0%,rgba(83,75,93,0)_100%)] last:after:hidden md:py-18.5 md:after:inset-x-auto md:after:inset-y-0 md:after:right-0 md:after:h-full md:after:w-px md:last:after:hidden"
            >
              <Image
                className="size-16 md:size-20"
                src={item.image}
                alt=""
                width={80}
                height={80}
                loading="lazy"
              />
              <p className="text-base leading-tight font-medium tracking-tighter text-white">
                {item.title}
              </p>
            </li>
          ))}
        </ul>

        <div
          className="pointer-events-none absolute top-0 left-1/2 h-151.75 w-240.75 -translate-x-[calc(50%+210px)] -translate-y-[calc(50%-210px)] rounded-[50%] bg-[radial-gradient(50%_50%_at_50%_50%,#7599F5_0%,rgba(117,153,245,0)_100%)] opacity-10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-0 left-1/2 h-151.75 w-240.75 -translate-x-[calc(50%-250px)] -translate-y-[calc(50%-210px)] rounded-[50%] bg-[radial-gradient(50%_50%_at_50%_50%,#F575E0_0%,rgba(245,117,224,0)_100%)] opacity-10 blur-[37px]"
          aria-hidden
        />
      </div>
    </section>
  )
}

export default Compliance
