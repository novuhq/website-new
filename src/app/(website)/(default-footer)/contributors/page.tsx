import type { Metadata } from "next"

import { getMetadata } from "@/lib/get-metadata"
import Contributors from "@/components/pages/contributors"

export default function ContributorsPage() {
  return <Contributors />
}

export const metadata: Metadata = getMetadata({
  title: "Novu - Contributors",
  description:
    "The ultimate library for managing multi-channel transactional notifications with a single API.",
  pathname: "/contributors",
  imagePath: "/images/pages/contributors/social-preview.jpg",
})
