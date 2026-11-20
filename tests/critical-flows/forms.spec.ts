import { expect, test } from "@playwright/test"

import { careersContract } from "./contracts"
import {
  expectHealthyPage,
  expectReactHandlerReady,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

test.describe("critical submission journeys", () => {
  test(`[${careersContract.id}] validates and submits the careers interest form`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    const submissions: string[] = []

    await page.route("**/api/careers/apply", async (route) => {
      submissions.push(route.request().postData() || "")
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      })
    })

    await gotoCriticalPage(page, careersContract.route)
    await expect(
      page.getByRole("heading", { level: 1, name: careersContract.heading })
    ).toBeVisible()

    const form = page
      .getByRole("heading", { level: 2, name: "Want to work with us?" })
      .locator("xpath=ancestor::section")
      .locator("form")
    await expectReactHandlerReady(form, "onSubmit")

    await form.getByRole("button", { name: "Submit" }).click()
    await expect(form).toContainText("Please enter your full name.")
    expect(submissions).toHaveLength(0)

    await form.getByLabel("Full Name").fill("Critical Flow Tester")
    await form.getByLabel("Your email").fill(careersContract.email)
    await form
      .getByLabel("LinkedIn profile")
      .fill("https://www.linkedin.com/in/critical-flow-tester")
    await form.getByLabel("Location (city and country)").fill("Berlin, Germany")
    await form
      .locator('select[name="remoteAsyncExperience"]')
      .selectOption("Yes")
    await form.locator('select[name="department"]').selectOption("Engineering")
    await form.locator('input[name="cv"]').setInputFiles({
      name: "critical-flow-cv.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\n% Critical flow fixture\n"),
    })
    await form.getByRole("button", { name: "Submit" }).click()

    await expect(form.getByRole("status")).toHaveText(careersContract.success)
    expect(submissions).toHaveLength(1)
    expect(submissions[0]).toContain(careersContract.email)
    expect(submissions[0]).toContain("critical-flow-cv.pdf")
    expectHealthyPage(applicationErrors)
  })
})
