import { tgdCalcDegToRad } from "@tolokoban/tgd"
import { type BrickOption, EnumBonusType } from "./types"

export const OPTIONS: Record<string, BrickOption> = {
    T: { bonus: EnumBonusType.TripleBall },
    G: { bonus: EnumBonusType.StickyPad },
    F: { bonus: EnumBonusType.BurningBall },
    L: { bonus: EnumBonusType.LargePad },
    S: { bonus: EnumBonusType.SmallPad },
    U: { bonus: EnumBonusType.UpsideDown },
}

"abcdefghijklmno".split("").forEach((letter, index) => {
    OPTIONS[letter] = { hue: tgdCalcDegToRad(24 * index) }
})
