import { readFile } from "node:fs/promises"
import { URL } from "node:url"

const manifestPath = new URL(
  "../.next/prerender-manifest.json",
  import.meta.url
)
const manifest = JSON.parse(await readFile(manifestPath, "utf8"))
const homepage = manifest.routes?.["/"]

if (!homepage || homepage.compute !== "static") {
  throw new Error(
    "Release contract failed: the homepage must remain statically computed."
  )
}

if (homepage.initialRevalidateSeconds !== 3600) {
  throw new Error(
    "Release contract failed: the homepage must keep its one-hour revalidation interval."
  )
}

console.info(
  "Release build contract verified: homepage is ISR with a 1h interval."
)
