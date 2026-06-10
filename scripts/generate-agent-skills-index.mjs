import { createHash } from "node:crypto"
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { basename, join, relative } from "node:path"
import { spawnSync } from "node:child_process"

const SCHEMA_URI =
  "https://schemas.agentskills.io/discovery/0.2.0/schema.json"
const SKILLS_SOURCE_DIR = join(process.cwd(), ".agents", "skills")
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

function ensureCleanOutputDirectory() {
  rmSync(OUTPUT_DIR, { recursive: true, force: true })
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

function publishSkillMd(skillName, skillDirectory) {
  const destinationDirectory = join(OUTPUT_DIR, skillName)
  mkdirSync(destinationDirectory, { recursive: true })

  const sourceSkillMd = join(skillDirectory, "SKILL.md")
  const destinationSkillMd = join(destinationDirectory, "SKILL.md")
  cpSync(sourceSkillMd, destinationSkillMd)

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
  if (!existsSync(SKILLS_SOURCE_DIR)) {
    throw new Error(`Skills source directory not found: ${SKILLS_SOURCE_DIR}`)
  }

  const skillDirectories = readdirSync(SKILLS_SOURCE_DIR, {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(SKILLS_SOURCE_DIR, entry.name))
    .filter((directory) => existsSync(join(directory, "SKILL.md")))
    .sort((left, right) => relative(SKILLS_SOURCE_DIR, left).localeCompare(
      relative(SKILLS_SOURCE_DIR, right),
    ))

  return skillDirectories.map((skillDirectory) => {
    const skillMdPath = join(skillDirectory, "SKILL.md")
    const metadata = parseFrontmatter(skillMdPath)
    const directoryName = basename(skillDirectory)

    if (metadata.name !== directoryName) {
      throw new Error(
        `Skill directory "${directoryName}" does not match frontmatter name "${metadata.name}"`,
      )
    }

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

  console.info(`Published ${skills.length} skills to ${OUTPUT_DIR}`)
}

main()
