import Image from "next/image"

import { IMenuHeaderCard } from "@/types/common"
import { Link } from "@/components/ui/link"

interface ICardProps extends IMenuHeaderCard {
  type?: "changelog" | "blog" | "link"
}

function Card({ title, description, href, image, type }: ICardProps) {
  return (
    <Link
      className="-mr-px block pt-0.5 !text-foreground hover:!text-primary"
      href={href}
      {...(type === "link" || type === "blog"
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <div className="header-card-gradient relative aspect-[220/124] overflow-hidden rounded-md border border-[#333347]/50">
        <Image
          className="object-cover"
          src={image}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          sizes="100vw"
          fill
        />
      </div>
      <p className="mt-3 line-clamp-2 leading-tight font-medium text-balance text-inherit">
        {title}
      </p>
      <p className="mt-1.5 line-clamp-3 text-sm leading-tight font-light text-pretty text-[#909090]">
        {description}
      </p>
    </Link>
  )
}

export default Card
