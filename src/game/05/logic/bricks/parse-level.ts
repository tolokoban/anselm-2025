import { TgdSprite } from "@tolokoban/tgd"
import { isNumber } from "@tolokoban/type-guards"
import { ArkanoidLevel } from "../../levels/types"
import { LogicBrick } from "./brick"

const INDEXES: Record<string, number> = {
    "[": 0,
    "(": 1,
    "<": 2,
    "{": 5,
}

export function parseLevel(
    level: ArkanoidLevel,
    add: () => TgdSprite
): { bricks: LogicBrick[][]; count: number } {
    const spritesPerRow: LogicBrick[][] = []
    let count = 0
    let y = 12
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
                })
                currentSprites.push(brick)
                if (index < INDEXES["{"]) count++
            }
            x++
        }
        y--
    }
    return { bricks: spritesPerRow, count }
}
