import path from "path"

import config from "@/configs/website-config"

export const INTEGRATIONS_DIR = path.join(
  process.cwd(),
  config.integrations.contentDir
)
