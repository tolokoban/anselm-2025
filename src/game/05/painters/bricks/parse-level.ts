import { TgdPainterSprites } from "@tolokoban/tgd"
import { isNumber } from "@tolokoban/type-guards"
import { ArkanoidLevel } from "../../levels/types"
import { Brick, BrickOptions } from "./brick"

const INDEXES: Record<string, number> = {
    "[": 0,
    "(": 1,
    "<": 2,
    "{": 5,
}

export function parseLevel(
    spritesPainter: TgdPainterSprites,
    level: ArkanoidLevel
) {
    const spritesPerRow: Brick[][] = []
    let y = 12
    for (const row of level.pose) {
        let x = -12
        const currentSprites: Brick[] = []
        spritesPerRow.push(currentSprites)
        for (let i = 0; i < row.length; i++) {
            const index = INDEXES[row.charAt(i)]
            if (isNumber(index)) {
                const brick = new Brick(spritesPainter, {
                    index,
                    x,
                    y,
                })
                currentSprites.push(brick)
            }
            x++
        }
        y--
    }
    return spritesPerRow
}
