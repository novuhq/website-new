import { expect, test, type Page } from "@playwright/test"

import { navigationContract } from "./contracts"
import {
  expectHealthyPage,
  expectReactHandlerReady,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

async function expectDashboardNavigation(page: Page, linkName: string) {
  await page.route(
    `${navigationContract.authLinks.desktop[0].href}/**`,
    (route) =>
      route.fulfill({
        body: "<title>Dashboard handoff</title>",
        contentType: "text/html",
        status: 200,
      })
  )

  await page.getByRole("link", { name: linkName, exact: true }).click()
  await expect(page).toHaveURL(/^https:\/\/dashboard\.novu\.co\/?$/)
}

test.describe("critical responsive navigation", () => {
  test(`[${navigationContract.id}] opens pricing and preserves authentication destinations`, async ({
    isMobile,
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    await gotoCriticalPage(page, navigationContract.route)

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: navigationContract.heading,
      })
    ).toBeVisible()

    if (isMobile) {
      const menuButton = page.getByRole("button", { name: "Open menu" })
      await expectReactHandlerReady(menuButton, "onClick")
      await menuButton.click()
      await expect(
        page.getByRole("navigation", { name: "Mobile navigation" })
      ).toBeVisible()
    }

    const navigationRoot = isMobile
      ? page.getByRole("dialog", { name: "Menu" })
      : page.locator("header")
    const authLinks = isMobile
      ? navigationContract.authLinks.mobile
      : navigationContract.authLinks.desktop

    for (const authLink of authLinks) {
      await expect(
        navigationRoot.getByRole("link", {
          name: authLink.name,
          exact: true,
        })
      ).toHaveAttribute("href", authLink.href)
    }

    await navigationRoot
      .getByRole("link", { name: "Pricing", exact: true })
      .click()
    await expect(page).toHaveURL(/\/pricing\/?$/)
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: navigationContract.destinationHeading,
      })
    ).toBeVisible()
    expectHealthyPage(applicationErrors)
  })

  test(`[${navigationContract.id}] signed-out header action opens dashboard signup`, async ({
    isMobile,
    page,
  }) => {
    test.skip(isMobile, "Desktop authentication action")

    const applicationErrors = observeApplicationErrors(page)
    await gotoCriticalPage(page, navigationContract.route)

    const signedOutLink = navigationContract.authLinks.desktop[0]
    await expect(
      page.getByRole("link", { name: signedOutLink.name, exact: true })
    ).toHaveAttribute("href", signedOutLink.href)
    await expect(
      page.getByRole("link", {
        name: navigationContract.authLinks.desktopSignedIn[0].name,
        exact: true,
      })
    ).toHaveCount(0)

    await expectDashboardNavigation(page, signedOutLink.name)
    expectHealthyPage(applicationErrors)
  })

  test(`[${navigationContract.id}] signed-in header action opens dashboard`, async ({
    baseURL,
    context,
    isMobile,
    page,
  }) => {
    test.skip(isMobile, "Desktop authentication action")
    expect(baseURL).toBeTruthy()

    await context.addCookies([
      {
        name: navigationContract.authStateCookie,
        value: "signed-in",
        url: baseURL,
      },
    ])

    const applicationErrors = observeApplicationErrors(page)
    await gotoCriticalPage(page, navigationContract.route)

    const signedInLink = navigationContract.authLinks.desktopSignedIn[0]
    await expect(
      page.getByRole("link", { name: signedInLink.name, exact: true })
    ).toHaveAttribute("href", signedInLink.href)
    await expect(
      page.getByRole("link", {
        name: navigationContract.authLinks.desktop[0].name,
        exact: true,
      })
    ).toHaveCount(0)

    await expectDashboardNavigation(page, signedInLink.name)
    expectHealthyPage(applicationErrors)
  })
})
