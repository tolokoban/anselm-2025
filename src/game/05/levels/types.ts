import { assertType, isType } from "@tolokoban/type-guards"

export enum EnumBonusType {
    None = 0,
    TripleBall,
    StickyPad,
    BurningBall,
    LargePad,
    SmallPad,
    UpsideDown,
    Laser,
    Slow,
}

export type BrickOption = Partial<{
    bonus: EnumBonusType
    hueShift: number
    hueRandom: number
}>

export interface ArkanoidLevel {
    backgroundIndex: number
    backgroundRepeats?: number
    backgroundHueShift?: number
    hueShift?: number
    hueRandom?: number
    pose: string[]
    options?: Record<string, BrickOption>
}

export function isArkanoidLevelArray(data: unknown): data is ArkanoidLevel[] {
    try {
        assertType(data, [
            "array",
            {
                backgroundIndex: "number",
                backgroundRepeats: ["?", "number"],
                backgroundHueShift: ["?", "number"],
                hueShift: ["?", "number"],
                hueRandom: ["?", "number"],
                pose: ["array", "string"],
                options: [
                    "?",
                    [
                        "map",
                        {
                            bonus: ["?", "number"],
                            hueShift: ["?", "number"],
                            hueRandom: ["?", "number"],
                        },
                    ],
                ],
            },
        ])
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}
