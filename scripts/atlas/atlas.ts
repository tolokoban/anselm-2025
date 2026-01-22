import FS from "node:fs"
import Path from "node:path"
import Chalk from "chalk"
import Sharp from "sharp"

import { getArguments } from "./lib/args.ts"
import { listImages } from "./lib/filesystem.ts"
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
                `${Chalk.gray(
                    Path.dirname(outputFilename)
                )}/${Chalk.cyanBright.bold(Path.basename(outputFilename))}`
            )
            const frames: Array<{
                image: Sharp.Sharp
                x: number
                y: number
                w: number
                h: number
            }> = []
            const x = 0
            let y = 0
            let ww = 0
            let hh = 0
            for (const inputImage of inputImages) {
                const { width, height } = await inputImage.metadata()
                ww = Math.max(ww, width)
                frames.push({
                    image: inputImage,
                    x,
                    y,
                    w: width,
                    h: height,
                })
                y += height
                hh = Math.max(hh, y)
            }
            ww = 2 ** Math.ceil(Math.log2(ww))
            hh = 2 ** Math.ceil(Math.log2(hh))
            let outputImage = Sharp({
                create: {
                    width: ww,
                    height: hh,
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
            } = { size: [ww, hh], sprites: {} }
            let index = 0
            for (const frame of frames) {
                atlasJson.sprites[`${make.name}${index++}`] = {
                    x: frame.x / ww,
                    y: frame.y / hh,
                    width: frame.w / ww,
                    height: frame.h / hh,
                }
            }
            FS.writeFileSync(
                Path.resolve(make.output.path, `${make.name}.ts`),
                `export default const Atlas = ${JSON.stringify(atlasJson, null, 2)}`
            )
            console.log(
                "Dimension:",
                Chalk.cyanBright(ww),
                "×",
                Chalk.cyanBright(hh)
            )
        }
    }
}

start()
