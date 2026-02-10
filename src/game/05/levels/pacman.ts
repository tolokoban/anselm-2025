import { OPTIONS } from "./common"
import { type ArkanoidLevel, EnumBonusType } from "./types"

export const pacman: ArkanoidLevel = {
    hueShift: 40,
    hueRandom: 10,
    pose: [
        "         {}{}{}{}         ",
        "        {}[][][]{}        ",
        "      {}[][][][][]{}      ",
        "      {}[][][][][]{}      ",
        "    {}[][][]<F<F[][]{}    ",
        "    {}[][][]<F<F[][]{}    ",
        "   {}[][][][][][][][T{}   ",
        "   {}[][][][][][][]       ",
        "  {}[][][][][][]          ",
        "  {}[][][][T              ",
        "  {}[][][][][][]          ",
        "   {}[][][][][][][]       ",
        "   {}[][][][][][][][T{}   ",
        "    {}[][][][][][][]{}    ",
        "    {}[][][][][][][]{}    ",
        "      {}[][][][][]{}      ",
        "      {}[][][][][]{}      ",
        "        {}[][][]{}        ",
        "         {}{}{}{}         ",
    ],
    backgroundIndex: 4,
    backgroundRepeats: 2,
    backgroundHueShift: 180,
    options: OPTIONS,
}
