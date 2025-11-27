import { NextRequest, NextResponse } from "next/server"

const HUBSPOT_API_ENDPOINT =
  "https://api.hsforms.com/submissions/v3/integration/secure/submit"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { formId, data } = body

    if (!formId || !data) {
      return NextResponse.json(
        { error: true },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      )
    }

    const portalId = process.env.NEXT_PUBLIC_HUBSPOT_FORM_PORTAL_ID
    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN

    if (!portalId || !accessToken) {
      return NextResponse.json(
        { error: true, message: "Server configuration error" },
        { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
      )
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const response = await fetch(
      `${HUBSPOT_API_ENDPOINT}/${portalId}/${formId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      }
    )
    clearTimeout(timeoutId)

    if (response.status >= 400) {
      const errorData = await response.json().catch(() => ({}))
      const message = errorData.message || "HubSpot API error"

      return NextResponse.json(
        { error: true, message },
        {
          status: response.status,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      )
    }

    return NextResponse.json(
      { sent: true },
      { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
    )
  } catch (error) {
    const errMessage =
      error instanceof Error
        ? error.message || error.toString() || "Internal server error"
        : "Internal server error"

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: true, message: "Request timeout" },
        { status: 504, headers: { "Access-Control-Allow-Origin": "*" } }
      )
    }

    return NextResponse.json(
      { error: true, message: errMessage },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    )
  }
}
