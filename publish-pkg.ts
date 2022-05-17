"use strict"
import * as fs from "fs"
import { contentProvider } from "@empreintes/content-provider"
import ErrnoException = NodeJS.ErrnoException

const PACKAGE_JSON = JSON.parse(
  contentProvider({ file_extension: "json", base_path: "." })("package")
)
const README = contentProvider({ file_extension: "md", base_path: "." })(
  "README"
)
const DIST_FOLDER = "./dist"

const log = (error: ErrnoException | null) => {
  if (error) throw error
}

delete PACKAGE_JSON["scripts"]
delete PACKAGE_JSON["devDependencies"]
delete PACKAGE_JSON["packageManager"]
delete PACKAGE_JSON["main"]

fs.writeFile(
  `${DIST_FOLDER}/package.json`,
  JSON.stringify(PACKAGE_JSON),
  "utf8",
  log
)
fs.writeFile(`${DIST_FOLDER}/README.md`, README, "utf8", log)
