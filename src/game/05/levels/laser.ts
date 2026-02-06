import { OPTIONS } from "./common"
import type { ArkanoidLevel } from "./types"

export const laser: ArkanoidLevel = {
    hueShift: 180,
    pose: [
        "<><Z<><><Z<><Z<><Z<><><Z<>",
        "<>()()()()()()()()()()()<>",
        "<>()[d[d[d[d[d[d[d[d[d()<>",
        "<>()[d()()()(Z()()()[d()<>",
        "<>()[d()()()(Z()()()[d()<>",
        "<>()[d[d[d[d[d[d[d[d[d()<>",
        "<>()()()()()()()()()()()<>",
        "<><Z<><Z<><><Z<><><Z<><Z<>",
        "<>()()()()()()()()()()()<>",
        "<>()[i[i[i[i[i[i[i[i[i()<>",
        "<>()[i()()()(Z()()()[i()<>",
        "<>()[i()()()(Z()()()[i()<>",
        "<>()[i[i[i[i[i[i[i[i[i()<>",
        "<>()()()()()()()()()()()<>",
        "<><Z<><><Z<><Z<><Z<><><Z<>",
    ],
    options: OPTIONS,
}
