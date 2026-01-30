import { OPTIONS } from "./common"
import { type ArkanoidLevel, EnumBonusType } from "./types"

export const spaceinvader: ArkanoidLevel = {
    pose: [
        "      (T          (T      ",
        "      (T          (T      ",
        "        (F      (F       ",
        "        (F      (F       ",
        "      [][][][][][][]      ",
        "      [][][][][][][]      ",
        "    [][]<><>[]<><>[][]    ",
        "    [][]<><F[]<F<>[][]    ",
        "  [][][][][][][][][][][]  ",
        "  [][S[][][][S[][][][S[]  ",
        "  []  []{}{}{}{}{}[]  []  ",
        "  []  []          []  []  ",
        "  []  []          []  []  ",
        "        [][L  [L[]        ",
        "        S][]  [][S        ",
    ],
    options: OPTIONS,
}
