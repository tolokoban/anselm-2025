import { TgdFilterHueRotation, TgdTexture2D } from "@tolokoban/tgd"
import Background01URL from "@/gfx/05/background-01.webp"
import Background02URL from "@/gfx/05/background-02.webp"
import Background03URL from "@/gfx/05/background-03.webp"
import Background04URL from "@/gfx/05/background-04.webp"
import type { ArkanoidLevel } from "./levels/types"

const Backgrounds = [
    Background01URL,
    Background02URL,
    Background03URL,
    Background04URL,
]

export function getBackgroundURL(index: number) {
    return Backgrounds[index % Backgrounds.length]
}

export function getBackgroundTexture(
    context: { gl: WebGL2RenderingContext; paint: () => void },
    level: ArkanoidLevel
) {
    const texture = new TgdTexture2D(context, {
        load: getBackgroundURL(level.backgroundIndex ?? 0),
        params: {
            minFilter: "LINEAR",
            magFilter: "LINEAR",
            wrapR: "REPEAT",
            wrapS: "REPEAT",
            wrapT: "REPEAT",
        },
        filter: new TgdFilterHueRotation({
            hueShiftInDegrees: level.backgroundHueShift ?? 0,
        }),
    })
    texture.eventChange.addListener(context.paint)
    return texture
}
