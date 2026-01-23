import { TgdPainterSprites, TgdSprite } from "@tolokoban/tgd"

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

    /**
     * @returns `false` if indestructible.
     */
    punch(time: number): boolean {
        if (this.sprite.index === 5) return false

        if (time - this.lastPunchTime > 0.3) {
            if (this.sprite.index === 2 || this.sprite.index === 3) {
                this.sprite.index++
            } else this.sprite.z += 100
            return true
        }
        this.lastPunchTime = time
        return false
    }
}
