import FS from "node:fs"
import Path from "node:path"
import Chalk from "chalk"
import Sharp from "sharp"

import { getArguments } from "./lib/args.ts"
import { pascalCase } from "./lib/case.ts"
import { listImages } from "./lib/filesystem.ts"
import { pack } from "./lib/pack.ts"
import { printTitle } from "./lib/title.ts"

async function start() {
    printTitle()
    const configs = getArguments()
    for (const config of configs) {
        for (const make of config.make) {
            const inputFiles = await listImages(make.input.path)
            const inputImages: Sharp.Sharp[] = inputFiles.map((file) =>
                Sharp(file)
            )
            const outputFilename = Path.resolve(
                make.output.path,
                `${make.name}.webp`
            )
            console.log(
                `${Chalk.gray(Path.dirname(outputFilename))}/${Chalk.cyanBright.bold(
                    Path.basename(outputFilename)
                )}`
            )
            const { size, frames } = await pack(inputImages)
            const [width, height] = size
            const finalWidth = 2 ** Math.ceil(Math.log2(width))
            const finalHeight = 2 ** Math.ceil(Math.log2(height))
            let outputImage = Sharp({
                create: {
                    width: finalWidth,
                    height: finalHeight,
                    channels: 4,
                    background: "#0000",
                },
            })
            const overlays: Sharp.OverlayOptions[] = []
            for (const frame of frames) {
                overlays.push({
                    input: await frame.image.toBuffer(),
                    left: frame.x,
                    top: frame.y,
                })
            }
            outputImage = outputImage.composite(overlays)
            await outputImage
                .webp({
                    alphaQuality: 100,
                    quality: 80,
                })
                .toFile(outputFilename)
            const atlasJson: {
                size: [number, number]
                sprites: Record<
                    string,
                    {
                        x: number
                        y: number
                        width: number
                        height: number
                    }
                >
            } = { size: [finalWidth, finalHeight], sprites: {} }
            let index = 0
            for (const frame of frames) {
                atlasJson.sprites[`${make.name}${index++}`] = {
                    x: frame.x / finalWidth,
                    y: frame.y / finalHeight,
                    width: frame.w / finalWidth,
                    height: frame.h / finalHeight,
                }
            }
            FS.writeFileSync(
                Path.resolve(make.output.path, `${make.name}.ts`),
                `export const AtlasDef${pascalCase(make.name)} = ${JSON.stringify(
                    atlasJson,
                    null,
                    2
                )}`
            )
            console.log(
                "Dimension:",
                Chalk.cyanBright(finalWidth),
                "×",
                Chalk.cyanBright(finalHeight)
            )
        }
    }
}

start()
