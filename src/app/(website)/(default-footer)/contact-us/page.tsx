import type { Metadata } from "next"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import ContactUs from "@/components/pages/contact-us"

export default function ContactUsPage() {
  return <ContactUs />
}

export const metadata: Metadata = getMetadata({
  ...SEO_DATA.contactUs,
})
