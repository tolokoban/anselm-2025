import {
    TgdPainterSprites,
    TgdSprite,
    tgdCalcDegToRad,
    tgdCalcMapRange,
    tgdCalcModulo,
    tgdCalcRandom,
} from "@tolokoban/tgd"
import { HitResult } from "../../types"

export interface BallOptions {
    hit(x: number, y: number, dx: number, dy: number): HitResult | null
}

export class Ball {
    public powerBall = false

    public speed = 0

    private readonly sprite: TgdSprite

    private _angle = 0
    private _dirX = 0
    private _dirY = 1
    private timeShift = tgdCalcRandom(15)

    constructor(
        private readonly spritesPainter: TgdPainterSprites,
        private readonly options: BallOptions
    ) {
        this.sprite = spritesPainter.spriteCreate()
    }

    get x() {
        return this.sprite.x
    }
    set x(value: number) {
        this.sprite.x = value
    }

    get y() {
        return this.sprite.y
    }
    set y(value: number) {
        this.sprite.y = value
    }

    get angle() {
        return this._angle
    }
    set angle(value: number) {
        if (value === this._angle) return

        this._angle = value
        const radians = tgdCalcDegToRad(value)
        this.sprite.angle = radians
        this._dirX = Math.sin(-radians)
        this._dirY = Math.cos(-radians)
    }

    update(time: number, delay: number) {
        const { sprite } = this
        const interval = 0.3
        const alpha = tgdCalcMapRange(
            tgdCalcModulo(time, 0, interval),
            0,
            interval,
            0,
            1
        )
        sprite.index = Math.floor(8 * alpha) + (this.powerBall ? 8 : 0)

        const dx = this._dirX * this.speed * delay
        const dy = this._dirY * this.speed * delay
        sprite.x += dx
        sprite.y += dy
        if ((dy > 0 && sprite.y > 13) || (dy < 0 && sprite.y < -13)) {
            this.angle = 180 - this.angle + tgdCalcRandom(-3, +3)
        }
        if ((dx > 0 && sprite.x > 13) || (dx < 0 && sprite.x < -13)) {
            this.angle = -this.angle + tgdCalcRandom(-3, +3)
        }

        const hit = this.options.hit(sprite.x, sprite.y, dx, dy)
        if (hit && !this.powerBall) {
            this.angle = 2 * hit.normalAngleDeg - (this.angle + 180)
        }

        this.powerBall = tgdCalcModulo(time + this.timeShift, 0, 20) > 15
    }
}
