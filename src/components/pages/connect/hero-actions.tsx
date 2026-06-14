"use client"

import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { Button } from "@/components/ui/button"

import ConnectCommandInput from "./command-input"

function ConnectHeroActions() {
  return (
    <div className="flex w-full max-w-[303px] flex-col items-stretch gap-3 sm:max-w-[467px] sm:flex-row sm:items-center sm:gap-5 lg:mx-0 lg:justify-start">
      <ConnectCommandInput clickLocation="connect_hero" />

      <Button
        variant="outline"
        size="lg"
        className="w-full max-w-[303px] overflow-visible sm:w-36 sm:max-w-none"
        asChild
      >
        <NextLink
          href={ROUTE.dashboardV2SignUp}
          target="_blank"
          rel="noopener noreferrer"
          data-click-location="connect_hero"
          data-click-text="sign_up"
        >
          Sign Up
        </NextLink>
      </Button>
    </div>
  )
}

export default ConnectHeroActions
