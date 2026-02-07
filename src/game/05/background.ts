import Background01URL from "@/gfx/05/background-01.webp"
import Background02URL from "@/gfx/05/background-02.webp"

const Backgrounds = [Background01URL, Background02URL]

export function getBackgroundURL(level: number) {
    return Backgrounds[level % Backgrounds.length]
}
