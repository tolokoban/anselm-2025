import {
    type TgdSprite,
    type TgdSpriteHue,
    tgdCalcRandom,
} from "@tolokoban/tgd"
import { isNumber } from "@tolokoban/type-guards"
import type { ArkanoidLevel } from "../../levels/types"
import { EnumBrickType, LogicBrick } from "./brick"

const INDEXES: Record<string, number> = {
    "[": 0,
    "(": 1,
    "<": 2,
    "{": 5,
}

export function parseLevel(
    level: ArkanoidLevel,
    add: () => TgdSpriteHue
): { bricks: LogicBrick[][]; count: number } {
    const spritesPerRow: LogicBrick[][] = []
    let count = 0
    let y = 12.5
    for (const row of level.pose) {
        let x = -12
        const currentSprites: LogicBrick[] = []
        spritesPerRow.push(currentSprites)
        for (let i = 0; i < row.length; i++) {
            const index = INDEXES[row.charAt(i)]
            if (isNumber(index)) {
                const brick = new LogicBrick(add(), {
                    index,
                    x,
                    y,
                    hue: 0,
                    ...level.options?.[row.charAt(i + 1)],
                })
                currentSprites.push(brick)
                if (brick.index !== EnumBrickType.Unbreakable) count++
            }
            x++
        }
        y--
    }
    return { bricks: spritesPerRow, count }
}
