import gangverkLogo from "@/images/pages/home/gangverk.svg"
import checkpointLogo from "@/images/pages/pricing/logos/checkpoint.svg"
import cloudSoftwareLogo from "@/images/pages/pricing/logos/cloud-software-group.svg"
import eburyLogo from "@/images/pages/pricing/logos/ebury.svg"
import elProffenLogo from "@/images/pages/pricing/logos/el-proffen.svg"
import medvolLogo from "@/images/pages/pricing/logos/medvol.svg"
import mongodbLogo from "@/images/pages/pricing/logos/mongodb.svg"
import trustflightLogo from "@/images/pages/pricing/logos/trustflight.svg"

import { cn } from "@/lib/utils"
import Logos from "@/components/ui/logos"

const CUSTOMER_LOGOS = [
  { name: "El Proffen", image: elProffenLogo },
  { name: "TrustFlight", image: trustflightLogo },
  { name: "MedVol", image: medvolLogo },
  { name: "Check Point", image: checkpointLogo },
  { name: "MongoDB", image: mongodbLogo },
  { name: "Cloud Software Group", image: cloudSoftwareLogo },
  { name: "Gangverk", image: gangverkLogo },
  { name: "Ebury", image: eburyLogo },
].map(({ name, image }) => ({
  src: image,
  alt: name,
  width: image.width,
  height: image.height,
  wrapperClassName: "flex h-6 w-36 items-center justify-center md:h-8",
  imageClassName: "h-auto max-h-6 w-auto max-w-full object-contain md:max-h-8",
}))

// The single-row customer logo marquee used under page heroes. Pass the outer
// spacing (and the hairline borders, where the section above needs separating)
// through className.
function CustomerLogosMarquee({ className }: { className?: string }) {
  return (
    <div
      className={cn("bg-black", className)}
      role="region"
      aria-label="Trusted by teams worldwide"
    >
      <div className="scrollbar-hidden mx-auto w-full max-w-384 overflow-hidden px-5 motion-reduce:overflow-x-auto md:px-8 2xl:px-0">
        <Logos
          logos={CUSTOMER_LOGOS}
          className="mx-0 p-0 lg:mx-0 lg:p-0"
          animationClassName="animate-logos will-change-transform motion-reduce:animate-none"
          trackClassName="h-18 md:h-21 lg:w-max"
          listClassName="gap-7 pr-7 lg:w-max lg:justify-start lg:gap-7 lg:pr-7"
          duplicateListClassName="gap-7 pr-7 motion-reduce:hidden lg:flex lg:gap-7 lg:pr-7"
          useMask
        />
      </div>
    </div>
  )
}

export default CustomerLogosMarquee
