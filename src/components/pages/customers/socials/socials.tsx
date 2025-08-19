import { ICustomerData } from "@/types/customers"
import { Link } from "@/components/ui/link"
import { Icons } from "@/components/icons"

const SOCIALS_COLLECTION = {
  x: {
    icon: "x",
    label: "Go to customer's X profile",
  },
  linkedin: {
    icon: "linkedin",
    label: "Go to customer's LinkedIn profile",
  },
  website: {
    icon: "link",
    label: "Go to customer's website",
  },
}

export default function Socials({
  socials,
}: {
  socials: ICustomerData["socials"]
}) {
  const order = ["x", "linkedin", "website"] as const

  if (!socials) {
    return null
  }

  const socialsData = order
    .filter((key) => socials[key] && key in SOCIALS_COLLECTION)
    .map((key) => {
      return {
        icon: SOCIALS_COLLECTION[key].icon,
        label: SOCIALS_COLLECTION[key].label,
        href: socials[key] as string,
      }
    })

  return (
    <ul className="social-share hidden gap-4 lg:flex">
      {socialsData.map(({ icon, label, href }, index) => {
        const Icon = Icons[icon as keyof typeof Icons]

        return (
          <li key={index}>
            <Link
              className="flex size-8 items-center justify-center rounded-full bg-gray-9 !p-0 text-gray-1 hover:!bg-foreground hover:text-gray-1"
              href={href}
            >
              <Icon className="!size-4" size={16} />
              <span className="sr-only">{label}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
