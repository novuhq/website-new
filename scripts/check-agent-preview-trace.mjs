import assert from "node:assert/strict"
import { lstatSync, readFileSync, realpathSync } from "node:fs"
import { dirname, resolve } from "node:path"

const tracePath = resolve(
  process.argv[2] ??
    ".next/server/app/(website)/api/agent-preview/route.js.nft.json"
)
const trace = JSON.parse(readFileSync(tracePath, "utf8"))
const tracedPaths = new Set(
  trace.files.map((file) => resolve(dirname(tracePath), file))
)
// A deployment cannot contain both a directory symlink and files beneath it.
for (const file of tracedPaths) {
  for (
    let parent = dirname(file);
    parent !== dirname(parent);
    parent = dirname(parent)
  ) {
    assert.ok(
      !tracedPaths.has(parent) || !lstatSync(parent).isSymbolicLink(),
      `The branding API deployment contains a file under a symlink: ${file}`
    )
  }
}
const files = new Set([...tracedPaths].map((file) => realpathSync(file)))
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
