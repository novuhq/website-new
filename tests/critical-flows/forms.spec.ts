import { expect, test } from "@playwright/test"

import { careersContract, subscriptionContract } from "./contracts"
import {
  expectHealthyPage,
  expectReactHandlerReady,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

test.describe("critical submission journeys", () => {
  test(`[${subscriptionContract.id}] validates and retries a blog subscription`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    const payloads: unknown[] = []
    let attempts = 0

    await page.route("**/api/hubspot", async (route) => {
      attempts += 1
      payloads.push(route.request().postDataJSON())

      await route.fulfill({
        status: attempts === 1 ? 500 : 200,
        contentType: "application/json",
        body: JSON.stringify(attempts === 1 ? {} : { error: false }),
      })
    })

    await gotoCriticalPage(page, subscriptionContract.route)
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: subscriptionContract.heading,
      })
    ).toBeVisible()

    const emailInput = page
      .getByRole("textbox", { name: "Email address" })
      .first()
    const form = emailInput.locator("xpath=ancestor::form")
    const submitButton = form.getByRole("button", { name: "Subscribe" })
    await expectReactHandlerReady(form, "onSubmit")

    await emailInput.fill("not-an-email")
    await submitButton.click()
    await expect(form).toContainText(subscriptionContract.validationError)
    expect(attempts).toBe(0)

    await emailInput.fill(subscriptionContract.email)
    await submitButton.click()
    await expect(form).toContainText(subscriptionContract.submissionError)
    await expect(submitButton).toBeEnabled()

    await submitButton.click()
    await expect(form).toContainText(subscriptionContract.success)
    expect(attempts).toBe(2)
    expect(payloads).toEqual([
      expect.objectContaining({
        data: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              name: "email",
              value: subscriptionContract.email,
            }),
          ]),
        }),
      }),
      expect.objectContaining({
        data: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              name: "email",
              value: subscriptionContract.email,
            }),
          ]),
        }),
      }),
    ])
    expectHealthyPage(applicationErrors)
  })

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
