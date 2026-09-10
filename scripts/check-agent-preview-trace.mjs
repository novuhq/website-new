import assert from "node:assert/strict"
import { readFileSync, realpathSync } from "node:fs"
import { dirname, resolve } from "node:path"

const tracePath = resolve(
  process.argv[2] ??
    ".next/server/app/(website)/api/agent-preview/route.js.nft.json"
)
const trace = JSON.parse(readFileSync(tracePath, "utf8"))
const files = new Set(
  trace.files.map((file) => realpathSync(resolve(dirname(tracePath), file)))
)
const libvipsPackages = [...files].filter((file) =>
  /[/\\]@img[/\\]sharp-libvips-[^/\\]+[/\\]package\.json$/.test(file)
)

// The local node_modules tree can hide native files missing from the deployment.
assert.ok(libvipsPackages.length, "The branding API must trace libvips")
for (const packagePath of libvipsPackages) {
  const metadata = JSON.parse(readFileSync(packagePath, "utf8"))
  const binary = realpathSync(
    resolve(dirname(packagePath), metadata.exports["./binary"])
  )
  assert.ok(
    files.has(binary),
    `The branding API deployment is missing its native library: ${binary}`
  )
}

console.info("Branding API deployment includes its native image libraries.")
