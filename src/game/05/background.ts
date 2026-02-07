import Background01URL from "@/gfx/05/background-01.webp"
import Background02URL from "@/gfx/05/background-02.webp"
import Background03URL from "@/gfx/05/background-03.webp"
import Background04URL from "@/gfx/05/background-04.webp"

const Backgrounds = [
    Background01URL,
    Background02URL,
    Background03URL,
    Background04URL,
]

export function getBackgroundURL(level: number) {
    return Backgrounds[level % Backgrounds.length]
}
