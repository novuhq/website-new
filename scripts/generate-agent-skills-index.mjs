import { createHash } from "node:crypto"
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { basename, join } from "node:path"
import { spawnSync } from "node:child_process"

const SCHEMA_URI =
  "https://schemas.agentskills.io/discovery/0.2.0/schema.json"
const NOVU_SKILLS_REPO = "https://github.com/novuhq/skills.git"
const NOVU_SKILLS_REF = process.env.NOVU_SKILLS_REF ?? "main"
const SKILLS_SOURCE_DIR =
  process.env.NOVU_SKILLS_DIR ?? join(process.cwd(), ".cache", "novuhq-skills", "skills")
const OUTPUT_DIR = join(process.cwd(), "public", ".well-known", "agent-skills")

function sha256Digest(filePath) {
  const hash = createHash("sha256")
  hash.update(readFileSync(filePath))

  return `sha256:${hash.digest("hex")}`
}

function parseFrontmatter(skillMdPath) {
  const content = readFileSync(skillMdPath, "utf8")
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)

  if (!match) {
    throw new Error(`Missing YAML frontmatter in ${skillMdPath}`)
  }

  const frontmatter = match[1]
  const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim()
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim()

  if (!name || !description) {
    throw new Error(`Missing name or description in ${skillMdPath}`)
  }

  const normalizedDescription = description
    .replace(/^['"]|['"]$/g, "")
    .slice(0, 1024)

  return { name, description: normalizedDescription }
}

function listFilesRecursively(directory) {
  const entries = readdirSync(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...listFilesRecursively(entryPath))
      continue
    }

    files.push(entryPath)
  }

  return files
}

function hasSupportingFiles(skillDirectory) {
  const files = listFilesRecursively(skillDirectory)

  return files.some((filePath) => basename(filePath) !== "SKILL.md")
}

function ensureNovuSkillsSource() {
  if (process.env.NOVU_SKILLS_DIR) {
    if (!existsSync(join(SKILLS_SOURCE_DIR, ".."))) {
      throw new Error(`NOVU_SKILLS_DIR does not exist: ${SKILLS_SOURCE_DIR}`)
    }

    return
  }

  const cacheRoot = join(process.cwd(), ".cache", "novuhq-skills")
  mkdirSync(join(process.cwd(), ".cache"), { recursive: true })

  if (!existsSync(join(cacheRoot, ".git"))) {
    const cloneResult = spawnSync(
      "git",
      ["clone", "--depth", "1", "--branch", NOVU_SKILLS_REF, NOVU_SKILLS_REPO, cacheRoot],
      { stdio: "inherit" },
    )

    if (cloneResult.status !== 0) {
      throw new Error(`Failed to clone ${NOVU_SKILLS_REPO} at ref ${NOVU_SKILLS_REF}`)
    }

    return
  }

  const fetchResult = spawnSync(
    "git",
    ["fetch", "origin", NOVU_SKILLS_REF, "--depth", "1"],
    { cwd: cacheRoot, stdio: "inherit" },
  )

  if (fetchResult.status !== 0) {
    throw new Error(`Failed to fetch ${NOVU_SKILLS_REF} from ${NOVU_SKILLS_REPO}`)
  }

  const checkoutResult = spawnSync(
    "git",
    ["checkout", "FETCH_HEAD"],
    { cwd: cacheRoot, stdio: "inherit" },
  )

  if (checkoutResult.status !== 0) {
    throw new Error(`Failed to checkout ${NOVU_SKILLS_REF} in ${cacheRoot}`)
  }
}

function ensureCleanOutputDirectory() {
  rmSync(OUTPUT_DIR, { recursive: true, force: true })
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

function publishSkillMd(skillName, skillDirectory) {
  const destinationDirectory = join(OUTPUT_DIR, skillName)
  mkdirSync(destinationDirectory, { recursive: true })

  const sourceSkillMd = join(skillDirectory, "SKILL.md")
  const destinationSkillMd = join(destinationDirectory, "SKILL.md")
  writeFileSync(destinationSkillMd, readFileSync(sourceSkillMd))

  const digest = sha256Digest(destinationSkillMd)

  return {
    name: skillName,
    type: "skill-md",
    url: `/.well-known/agent-skills/${skillName}/SKILL.md`,
    digest,
  }
}

function publishArchive(skillName, skillDirectory) {
  const archivePath = join(OUTPUT_DIR, `${skillName}.tar.gz`)
  const archiveResult = spawnSync(
    "tar",
    ["-czf", archivePath, "-C", skillDirectory, "."],
    { stdio: "inherit" },
  )

  if (archiveResult.status !== 0) {
    throw new Error(`Failed to create archive for ${skillName}`)
  }

  const digest = sha256Digest(archivePath)

  return {
    name: skillName,
    type: "archive",
    url: `/.well-known/agent-skills/${skillName}.tar.gz`,
    digest,
  }
}

function discoverSkills() {
  ensureNovuSkillsSource()

  if (!existsSync(SKILLS_SOURCE_DIR)) {
    throw new Error(`Novu skills directory not found: ${SKILLS_SOURCE_DIR}`)
  }

  const skillDirectories = readdirSync(SKILLS_SOURCE_DIR, {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(SKILLS_SOURCE_DIR, entry.name))
    .filter((directory) => existsSync(join(directory, "SKILL.md")))
    .sort((left, right) => basename(left).localeCompare(basename(right)))

  return skillDirectories.map((skillDirectory) => {
    const skillMdPath = join(skillDirectory, "SKILL.md")
    const metadata = parseFrontmatter(skillMdPath)

    const artifact = hasSupportingFiles(skillDirectory)
      ? publishArchive(metadata.name, skillDirectory)
      : publishSkillMd(metadata.name, skillDirectory)

    return {
      name: artifact.name,
      type: artifact.type,
      description: metadata.description,
      url: artifact.url,
      digest: artifact.digest,
    }
  })
}

function main() {
  ensureCleanOutputDirectory()

  const skills = discoverSkills()
  const index = {
    $schema: SCHEMA_URI,
    skills,
  }

  writeFileSync(
    join(OUTPUT_DIR, "index.json"),
    `${JSON.stringify(index, null, 2)}\n`,
    "utf8",
  )

  console.info(
    `Published ${skills.length} Novu skills from novuhq/skills to ${OUTPUT_DIR}`,
  )
}

main()
