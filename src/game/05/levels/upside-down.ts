import { OPTIONS } from "./common"
import { type ArkanoidLevel, EnumBonusType } from "./types"

export const upsideDown: ArkanoidLevel = {
    hueShift: 120,
    pose: [
        "      (a         [][]     ",
        "     (b(b        [][]     ",
        "    (c(c(c       [][]     ",
        "   (d(d(d(d      [][]     ",
        "  (e(e(e(e(e     [][]     ",
        " (f  (f(f  (f    [][]     ",
        "     (g(g        [][]     ",
        "     (h(h        [][]     ",
        "     (i(i        [][]     ",
        "     (j(j    []  [][]  [] ",
        "     (k(k     [][][][][]  ",
        "     (l(l      [][][][]   ",
        "     (m(m       [][][]    ",
        "     (n(n        [][]     ",
        "     (o(o         []      ",
    ],
    backgroundIndex: 3,
    options: {
        ...OPTIONS,
        "]": { bonus: EnumBonusType.UpsideDown },
    },
}
