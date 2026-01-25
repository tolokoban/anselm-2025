import { TgdPainterSprites, TgdSprite } from "@tolokoban/tgd"
import { EnumBrick } from "../../types"

export interface BrickOptions {
    index: number
    x: number
    y: number
}

export class Brick {
    private readonly sprite: TgdSprite
    private lastPunchTime = 0

    constructor(
        private readonly spritesPainter: TgdPainterSprites,
        options: BrickOptions
    ) {
        this.sprite = spritesPainter.spriteCreate({
            ...options,
        })
    }

    get x() {
        return this.sprite.x
    }

    get y() {
        return this.sprite.y
    }

    get dead() {
        return this.sprite.z !== 0
    }

    get type(): EnumBrick {
        return this.sprite.index as EnumBrick
    }

    /**
     * @returns `false` if indestructible.
     */
    punch(time: number): boolean {
        if (this.type === EnumBrick.Unbreakable) return false

        if (time - this.lastPunchTime > 0.3) {
            if ([EnumBrick.Glass1, EnumBrick.Glass2].includes(this.type)) {
                this.sprite.index++
            } else this.sprite.z += 100
            return true
        }
        this.lastPunchTime = time
        return false
    }
}
