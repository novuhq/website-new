import type { LookupAddress } from "node:dns"
import dns from "node:dns/promises"
import http, { type IncomingMessage } from "node:http"
import https from "node:https"
import { isIP } from "node:net"

import ipaddr from "ipaddr.js"

type ResourceOptions = { maxBytes: number; accept: string }
type Resource = { url: URL; contentType: string; body: Buffer }

export type ResourceLoader = {
  load: (url: URL, options: ResourceOptions) => Promise<Resource>
  close: () => void
}

export class ResourceFetchError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number
  ) {
    super(message)
    this.name = "ResourceFetchError"
  }
}

const USER_AGENT =
  "Mozilla/5.0 (compatible; NovuAgentChatPreview/1.0; +https://novu.co)"
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308])
// Web ports only, so the preview cannot be used to probe other services.
const ALLOWED_PORTS = new Set(["", "80", "443", "8080", "8443"])

function isPublicAddress(address: string): boolean {
  if (!isIP(address)) return false
  const parsed = ipaddr.process(address)
  if (parsed.range() !== "unicast") return false
  // IPv6's unassigned address space is not a public destination. Mapped IPv4
  // has already been converted above, so private mapped addresses stay blocked.
  return parsed.kind() === "ipv4" || parsed.match(ipaddr.parseCIDR("2000::/3"))
}

/** Validate syntax and literal destinations; DNS is checked for every request. */
export function normalizeUrl(input: string): URL {
  const trimmed = input.trim()
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed)
  const isHostAndPort = /^[^/?#]+:\d+(?:[/?#]|$)/.test(trimmed)
  const url = new URL(
    hasScheme && !isHostAndPort ? trimmed : `https://${trimmed}`
  )
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ResourceFetchError("Only http and https URLs are supported")
  }
  if (url.username || url.password) {
    throw new ResourceFetchError("URL credentials are not allowed")
  }
  if (!ALLOWED_PORTS.has(url.port)) {
    throw new ResourceFetchError("That port is not supported")
  }
  const hostname = url.hostname
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "")
    .toLowerCase()
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    (isIP(hostname) && !isPublicAddress(hostname))
  ) {
    throw new ResourceFetchError("That host is not a public destination")
  }
  url.hash = ""
  return url
}

// "No such name" answers. Anything else (timeouts, refused or failing servers)
// may succeed on retry, so it is surfaced instead of reading as "no records".
const MISSING_RECORD_CODES = new Set(["ENOTFOUND", "ENODATA"])

/**
 * Resolve with c-ares rather than `dns.lookup`: getaddrinfo runs on libuv's
 * four-thread pool and cannot be cancelled, so a page pointing at hostnames
 * whose DNS never answers would stall every fs, crypto and sharp call on the
 * instance. c-ares queries stay off that pool, time out on their own, and are
 * cancelled with the extraction.
 */
async function resolveAddresses(
  hostname: string,
  signal: AbortSignal
): Promise<LookupAddress[]> {
  const resolver = new dns.Resolver({ timeout: 3000, tries: 1 })
  return new Promise<LookupAddress[]>((resolve, reject) => {
    const abort = () => {
      resolver.cancel()
      reject(signal.reason)
    }
    signal.addEventListener("abort", abort, { once: true })
    Promise.allSettled([
      resolver.resolve4(hostname),
      resolver.resolve6(hostname),
    ])
      .then(([v4, v6]) => {
        const addresses = [
          ...(v4.status === "fulfilled" ? v4.value : []).map((address) => ({
            address,
            family: 4,
          })),
          ...(v6.status === "fulfilled" ? v6.value : []).map((address) => ({
            address,
            family: 6,
          })),
        ]
        const failure = [v4, v6].find(
          (result): result is PromiseRejectedResult =>
            result.status === "rejected" &&
            !MISSING_RECORD_CODES.has(result.reason?.code)
        )
        if (!addresses.length && failure) reject(failure.reason)
        else resolve(addresses)
      })
      .finally(() => {
        signal.removeEventListener("abort", abort)
      })
  })
}

async function publicAddress(url: URL, signal: AbortSignal) {
  const hostname = url.hostname.replace(/^\[|\]$/g, "")
  const family = isIP(hostname)
  if (family) return { address: hostname, family }

  const addresses = await resolveAddresses(hostname, signal)
  signal.throwIfAborted()
  if (
    !addresses.length ||
    addresses.some(({ address }) => !isPublicAddress(address))
  ) {
    throw new ResourceFetchError(
      "DNS did not resolve exclusively to public addresses"
    )
  }
  return addresses[0]
}

async function fetchResource(
  url: URL,
  options: ResourceOptions,
  signal: AbortSignal
): Promise<Resource> {
  for (let redirects = 0; ; redirects += 1) {
    signal.throwIfAborted()
    const destination = normalizeUrl(url.href)
    const address = await publicAddress(destination, signal)
    signal.throwIfAborted()
    const transport = destination.protocol === "https:" ? https : http
    const response = await new Promise<IncomingMessage>((resolve, reject) => {
      const request = transport.request(
        destination,
        {
          method: "GET",
          agent: false,
          signal,
          family: address.family,
          // Preserve the original hostname for Host and TLS certificate checks,
          // while preventing a second DNS lookup from changing the destination.
          lookup: (_hostname, lookupOptions, callback) => {
            if (lookupOptions.all) callback(null, [address])
            else callback(null, address.address, address.family)
          },
          headers: {
            accept: options.accept,
            "accept-encoding": "identity",
            "user-agent": USER_AGENT,
          },
        },
        resolve
      )
      request.once("error", reject)
      request.end()
    })

    try {
      const status = response.statusCode ?? 0
      if (REDIRECT_STATUSES.has(status)) {
        if (redirects >= 3)
          throw new ResourceFetchError("Too many resource redirects")
        const location = response.headers.location
        if (!location)
          throw new ResourceFetchError("Redirect has no destination")
        url = normalizeUrl(new URL(location, destination).href)
        continue
      }
      if (status < 200 || status >= 300) {
        throw new ResourceFetchError(`Resource returned HTTP ${status}`, status)
      }
      const encoding = response.headers["content-encoding"]
      if (encoding && encoding.trim().toLowerCase() !== "identity") {
        throw new ResourceFetchError("Unsupported resource content encoding")
      }
      const contentLength = Number(response.headers["content-length"])
      if (contentLength > options.maxBytes) {
        throw new ResourceFetchError("Resource exceeds its size limit")
      }

      const chunks: Buffer[] = []
      let length = 0
      for await (const chunk of response) {
        signal.throwIfAborted()
        const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
        length += bytes.length
        if (length > options.maxBytes) {
          throw new ResourceFetchError("Resource exceeds its size limit")
        }
        chunks.push(bytes)
      }
      signal.throwIfAborted()
      return {
        url: destination,
        contentType: response.headers["content-type"] ?? "",
        body: Buffer.concat(chunks, length),
      }
    } finally {
      response.destroy()
    }
  }
}

/** One loader owns the complete extraction's deadline, queue, and sockets. */
export function createResourceLoader({
  timeoutMs = 8000,
  concurrency = 3,
}: {
  timeoutMs?: number
  concurrency?: number
} = {}): ResourceLoader {
  if (
    !Number.isFinite(timeoutMs) ||
    timeoutMs <= 0 ||
    !Number.isInteger(concurrency) ||
    concurrency < 1
  ) {
    throw new ResourceFetchError("Resource loader limits must be positive")
  }
  const limit = Math.min(concurrency, 3)
  const controller = new AbortController()
  const { signal } = controller
  let active = 0
  const queue: { resolve: () => void; reject: (reason: unknown) => void }[] = []
  const cancel = (message: string) => {
    const error = new ResourceFetchError(message)
    error.name = "AbortError"
    controller.abort(error)
    for (const waiting of queue.splice(0)) waiting.reject(error)
  }
  const timer = setTimeout(
    () => cancel("Resource loading deadline exceeded"),
    timeoutMs
  )

  const acquire = async () => {
    signal.throwIfAborted()
    if (active < limit) active += 1
    else
      await new Promise<void>((resolve, reject) =>
        queue.push({ resolve, reject })
      )
  }
  const release = () => {
    const next = queue.shift()
    if (next) next.resolve()
    else active -= 1
  }

  return {
    async load(url, options) {
      signal.throwIfAborted()
      const destination = normalizeUrl(url.href)
      if (!Number.isSafeInteger(options.maxBytes) || options.maxBytes < 1) {
        throw new ResourceFetchError("Resource byte limit must be positive")
      }
      await acquire()
      try {
        return await fetchResource(destination, options, signal)
      } catch (error) {
        if (signal.aborted) throw signal.reason
        throw error
      } finally {
        release()
      }
    },
    close() {
      clearTimeout(timer)
      cancel("Resource loader closed")
    },
  }
}
