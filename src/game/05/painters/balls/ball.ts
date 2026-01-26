import {
    type TgdPainterSprites,
    type TgdSprite,
    tgdCalcDegToRad,
    tgdCalcMapRange,
    tgdCalcModulo,
    tgdCalcRandom,
} from "@tolokoban/tgd"
import { EnumHitResult, type HitResult } from "../../types"

export class Ball {
    public powerBall = false

    public speed = 0

    private readonly sprite: TgdSprite

    private _angle = 0
    private _dirX = 0
    private _dirY = 1
    private _dx = 0
    private _dy = 0
    private timeShift = tgdCalcRandom(15)

    constructor(private readonly spritesPainter: TgdPainterSprites) {
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

    get dx() {
        return this._dx
    }

    get dy() {
        return this._dy
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
        this._dx = dx
        this._dy = dy
        this.powerBall = tgdCalcModulo(time + this.timeShift, 0, 20) > 15
    }

    applyHit(hit: HitResult) {
        if (hit.type === EnumHitResult.Wall || !this.powerBall) {
            this.angle = 2 * hit.normalAngleDeg - (this.angle + 180)
        }
    }
}
