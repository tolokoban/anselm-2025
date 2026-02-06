import { TgdEvent } from "@tolokoban/tgd"
import type { ArkanoidLevel, EnumBonusType } from "../../levels/types"
import type { PainterBricks } from "../../painters/bricks"
import { EnumBrickType, type LogicBrick } from "./brick"
import { parseLevel } from "./parse-level"

export class LogicBricks {
    public readonly eventVictory = new TgdEvent()
    public readonly eventBonus = new TgdEvent<{
        type: EnumBonusType
        x: number
        y: number
    }>()

    private _level: ArkanoidLevel | null = null
    private _count = 0
    private bricks: LogicBrick[][] = []

    constructor(private readonly painter: PainterBricks) {}

    get level() {
        return this._level
    }
    set level(value: ArkanoidLevel | null) {
        this._level = value
        this.clear()
        if (!value) return

        const { bricks, count } = parseLevel(value, this.painter.add)
        this.bricks = bricks
        this._count = count
    }

    clear() {
        this.painter.clear()
    }

    get count() {
        return this._count
    }
    private set count(v: number) {
        this._count = v
        if (v === 0) this.eventVictory.dispatch()
    }

    readonly hitTest = (args: {
        x: number
        y: number
        dx: number
        dy: number
    }): { normalAngle: number; brick: LogicBrick } | null => {
        const brick = this.getBrick(args)
        if (!brick) return null

        const normalAngle = brick.hitTest(args)
        if (
            [EnumBrickType.Glass, EnumBrickType.GlassBroken].includes(
                brick.index
            )
        ) {
            brick.index++
        } else if (brick.index !== EnumBrickType.Unbreakable) {
            brick.dead = true
            if (brick.bonus) {
                this.eventBonus.dispatch({
                    type: brick.bonus,
                    x: brick.x,
                    y: brick.y,
                })
            }
            this.painter.remove(brick.sprite)
            this.count--
        }
        return { normalAngle, brick }
    }

    private getBrick({ x, y }: { x: number; y: number }) {
        const row = Math.floor(13 - y)
        const bricks = this.bricks[row]
        if (!bricks) return null

        for (const brick of bricks) {
            if (
                !brick.dead &&
                Math.abs(brick.x - x) < 1 &&
                Math.abs(brick.y - y) < 0.5
            ) {
                return brick
            }
        }
        return null
    }
}
