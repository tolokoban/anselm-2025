import { readdir } from "node:fs/promises"
import Path from "node:path"

const RX = /^[0-9]+\.png$/g

export async function listImages(path: string): Promise<string[]> {
    const files: string[] = []
    const content = await readdir(path, { withFileTypes: true })
    for (const file of content) {
        if (!file.isFile()) continue

        RX.lastIndex = -1
        if (RX.test(file.name)) {
            files.push(Path.resolve(path, file.name))
        }
    }
    return files.sort()
}
