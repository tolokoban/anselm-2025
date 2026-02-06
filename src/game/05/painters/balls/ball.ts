import { readdir } from "node:fs/promises"
import {
    TgdEvent,
    type TgdPainterSprites,
    type TgdSprite,
    tgdCalcDegToRad,
    tgdCalcMapRange,
    tgdCalcModulo,
    tgdCalcRandom,
} from "@tolokoban/tgd"
import { EnumHitResult, type HitResult } from "../../types"

export class Ball {
    /**
     * The power ball does not bounce on bricks.
     * It traverses them, being more deadly.
     */
    public powerBall = false
    /**
     * The ball can be stuck to the pad
     */
    public stuck = true
    public speed = 0
    public readonly eventDead = new TgdEvent<Ball>()

    private readonly sprite: TgdSprite

    private padX = 0
    private padY = 0
    /**
     * When the ball is stuck on the pad,
     * we set its X position at `padX + padShift`.
     */
    private padShift = 0
    private _angle = 0
    private _dirX = 0
    private _dirY = 1
    private _dx = 0
    private _dy = 0
    private timeShift = tgdCalcRandom(15)

    constructor(private readonly spritesPainter: TgdPainterSprites) {
        this.sprite = spritesPainter.add({})
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

    delete() {
        this.speed = 0
        this.spritesPainter.remove(this.sprite)
    }

    setPadXY(x: number, y: number) {
        this.padX = x
        this.padY = y
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
        if (this.stuck) {
            sprite.x = this.padX + this.padShift
            sprite.y = this.padY + 0.65
            return
        }

        const dx = this._dirX * this.speed * delay
        const dy = this._dirY * this.speed * delay
        sprite.x += dx
        sprite.y += dy
        this._dx = dx
        this._dy = dy
    }

    applyHit(hit: HitResult) {
        if (hit.type === EnumHitResult.Death) {
            // The ball as fallen too far: it's dead!
            this.eventDead.dispatch(this)
        } else if (hit.type === EnumHitResult.Wall || !this.powerBall) {
            this.angle = 2 * hit.normalAngleDeg - (this.angle + 180)
        }
    }
}
