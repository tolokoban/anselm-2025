import FS from "node:fs"
import Path from "node:path"
import Process from "node:process"
import Chalk from "chalk"
import JSON5 from "json5"

import { camelCase } from "./case.ts"
import { ConfigFile, assertConfigFile } from "./types.ts"

export function getArguments(): ConfigFile[] {
    const { argv } = Process
    if (argv.length < 3) usage()
    const files: ConfigFile[] = []
    for (const arg of Process.argv.slice(2)) {
        const filePath = Path.resolve(arg)
        const root = Path.dirname(filePath)
        try {
            if (!FS.existsSync(filePath)) {
                throw new Error("File not found!")
            }
            const data = JSON5.parse(FS.readFileSync(filePath).toString())
            assertConfigFile(data)
            files.push(data)
            for (const atlas of data.make) {
                atlas.name = camelCase(atlas.name)
                const inputFolder = Path.resolve(root, atlas.input.path)
                if (!FS.existsSync(inputFolder)) {
                    throw Error(`Input folder not found:\n${inputFolder}`)
                }
                atlas.input.path = inputFolder
                const outputFolder = Path.resolve(root, atlas.output.path)
                if (!FS.existsSync(outputFolder)) {
                    throw Error(`Output folder not found:\n${outputFolder}`)
                }
                atlas.output.path = outputFolder
                atlas.output.columns ??= 1
            }
        } catch (error) {
            console.error(
                Chalk.red.bold(`Error parsing this file\n${filePath}\n`)
            )
            const message = error instanceof Error ? error.message : `${error}`
            console.error(Chalk.red.bold(message))
            console.error()
            console.error(error)
            console.error()
            Process.exit(2)
        }
    }
    return files
}

function usage() {
    console.log(Chalk.red.bold("We need at least one argument!"))
    console.log()
    console.log(
        "Each argument is the path to a JSON file that describes how to make an atlas."
    )
    console.log()
    Process.exit(1)
}
