import type { StaticImageData } from "next/image"

import logoBitmex from "./bitmex.svg"
import logoBpp from "./bpp.svg"
import logoCheckpoint from "./checkpoint.svg"
import logoCloudSoftwareGroup from "./cloud-software-group.svg"
import logoDeriv from "./deriv.svg"
import logoDocplannerGroup from "./docplanner-group.svg"
import logoEbury from "./ebury.svg"
import logoElProffen from "./el-proffen.svg"
import logoGuesty from "./guesty.svg"
import logoHemnet from "./hemnet.svg"
import logoInfluencer from "./influencer.svg"
import logoJoyride from "./joyride.svg"
import logoKantAkademi from "./kant-akademi.svg"
import logoKarmacheck from "./karmacheck.svg"
import logoKornFerry from "./korn-ferry.svg"
import logoLottiefiles from "./lottiefiles.svg"
import logoMedvol from "./medvol.svg"
import logoMoises from "./moises.svg"
import logoMongodb from "./mongodb.svg"
import logoNamirial from "./namirial.svg"
import logoNep from "./nep.svg"
import logoNormative from "./normative.svg"
import logoNovacy from "./novacy.svg"
import logoQuorumCyber from "./quorum-cyber.svg"
import logoRoche from "./roche.svg"
import logoSherweb from "./sherweb.svg"
import logoSinch from "./sinch.svg"
import logoTatilbudur from "./tatilbudur.svg"
import logoTenderd from "./tenderd.svg"
import logoTrustflight from "./trustflight.svg"
import logoUnified from "./unified.svg"
import logoUnity from "./unity.svg"
import logoUnops from "./unops.svg"
import logoWaltonEnterprises from "./walton-enterprises.svg"
import logoWhoppah from "./whoppah.svg"

type ImageModule = string | StaticImageData

function toImageSrc(image: ImageModule): string {
  return typeof image === "string" ? image : image.src
}

const PRICING_LOGOS_BASE_PATH = "@/images/pages/pricing/logos"

export const pricingLogoSrcMap: Record<string, string> = {
  [`${PRICING_LOGOS_BASE_PATH}/bitmex.svg`]: toImageSrc(logoBitmex),
  [`${PRICING_LOGOS_BASE_PATH}/bpp.svg`]: toImageSrc(logoBpp),
  [`${PRICING_LOGOS_BASE_PATH}/checkpoint.svg`]: toImageSrc(logoCheckpoint),
  [`${PRICING_LOGOS_BASE_PATH}/cloud-software-group.svg`]: toImageSrc(
    logoCloudSoftwareGroup
  ),
  [`${PRICING_LOGOS_BASE_PATH}/deriv.svg`]: toImageSrc(logoDeriv),
  [`${PRICING_LOGOS_BASE_PATH}/docplanner-group.svg`]:
    toImageSrc(logoDocplannerGroup),
  [`${PRICING_LOGOS_BASE_PATH}/ebury.svg`]: toImageSrc(logoEbury),
  [`${PRICING_LOGOS_BASE_PATH}/el-proffen.svg`]: toImageSrc(logoElProffen),
  [`${PRICING_LOGOS_BASE_PATH}/guesty.svg`]: toImageSrc(logoGuesty),
  [`${PRICING_LOGOS_BASE_PATH}/hemnet.svg`]: toImageSrc(logoHemnet),
  [`${PRICING_LOGOS_BASE_PATH}/influencer.svg`]: toImageSrc(logoInfluencer),
  [`${PRICING_LOGOS_BASE_PATH}/joyride.svg`]: toImageSrc(logoJoyride),
  [`${PRICING_LOGOS_BASE_PATH}/kant-akademi.svg`]: toImageSrc(logoKantAkademi),
  [`${PRICING_LOGOS_BASE_PATH}/karmacheck.svg`]: toImageSrc(logoKarmacheck),
  [`${PRICING_LOGOS_BASE_PATH}/korn-ferry.svg`]: toImageSrc(logoKornFerry),
  [`${PRICING_LOGOS_BASE_PATH}/lottiefiles.svg`]: toImageSrc(logoLottiefiles),
  [`${PRICING_LOGOS_BASE_PATH}/medvol.svg`]: toImageSrc(logoMedvol),
  [`${PRICING_LOGOS_BASE_PATH}/moises.svg`]: toImageSrc(logoMoises),
  [`${PRICING_LOGOS_BASE_PATH}/mongodb.svg`]: toImageSrc(logoMongodb),
  [`${PRICING_LOGOS_BASE_PATH}/namirial.svg`]: toImageSrc(logoNamirial),
  [`${PRICING_LOGOS_BASE_PATH}/nep.svg`]: toImageSrc(logoNep),
  [`${PRICING_LOGOS_BASE_PATH}/normative.svg`]: toImageSrc(logoNormative),
  [`${PRICING_LOGOS_BASE_PATH}/novacy.svg`]: toImageSrc(logoNovacy),
  [`${PRICING_LOGOS_BASE_PATH}/quorum-cyber.svg`]: toImageSrc(logoQuorumCyber),
  [`${PRICING_LOGOS_BASE_PATH}/roche.svg`]: toImageSrc(logoRoche),
  [`${PRICING_LOGOS_BASE_PATH}/sherweb.svg`]: toImageSrc(logoSherweb),
  [`${PRICING_LOGOS_BASE_PATH}/sinch.svg`]: toImageSrc(logoSinch),
  [`${PRICING_LOGOS_BASE_PATH}/tatilbudur.svg`]: toImageSrc(logoTatilbudur),
  [`${PRICING_LOGOS_BASE_PATH}/tenderd.svg`]: toImageSrc(logoTenderd),
  [`${PRICING_LOGOS_BASE_PATH}/trustflight.svg`]: toImageSrc(logoTrustflight),
  [`${PRICING_LOGOS_BASE_PATH}/unified.svg`]: toImageSrc(logoUnified),
  [`${PRICING_LOGOS_BASE_PATH}/unity.svg`]: toImageSrc(logoUnity),
  [`${PRICING_LOGOS_BASE_PATH}/unops.svg`]: toImageSrc(logoUnops),
  [`${PRICING_LOGOS_BASE_PATH}/walton-enterprises.svg`]: toImageSrc(
    logoWaltonEnterprises
  ),
  [`${PRICING_LOGOS_BASE_PATH}/whoppah.svg`]: toImageSrc(logoWhoppah),
}
