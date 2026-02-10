import { OPTIONS } from "./common"
import { type ArkanoidLevel, EnumBonusType } from "./types"

export const intro: ArkanoidLevel = {
    hueShift: 60,
    hueRandom: 30,
    pose: [
        "                          ",
        "        <><><><><>        ",
        "       [][][][][][]       ",
        "      (F(T(F()(F(T(F      ",
        "     [][][][][][][][]     ",
        "    (G(T(G(T(G(T(G(T(G    ",
        "     [][][][][][][][]     ",
        "      (G(T(G(T(G(T(G      ",
        "       [][][][][][]       ",
        "        (F(T(G(T(F        ",
    ],
    backgroundIndex: 0,
    options: OPTIONS,
}
