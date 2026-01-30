import { type ArkanoidLevel, EnumBonusType } from "./types"

export const debug: ArkanoidLevel = {
    pose: ["                          ", "      (S(L(L(S(L(L(S      "],
    options: {
        T: { bonus: EnumBonusType.TripleBall },
        G: { bonus: EnumBonusType.StickyPad },
        F: { bonus: EnumBonusType.BurningBall },
        L: { bonus: EnumBonusType.LargePad },
        S: { bonus: EnumBonusType.SmallPad },
    },
}
