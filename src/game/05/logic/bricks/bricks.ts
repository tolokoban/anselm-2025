import { TgdEvent } from "@tolokoban/tgd"
import { PainterBricks } from "../../painters/bricks"
import { ArkanoidLevel } from "../../levels/types"
import { parseLevel } from "./parse-level"
import { EnumBrickType, LogicBrick } from "./brick"

export class LogicBricks {
    public readonly eventVictory = new TgdEvent()

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
    }): number | null => {
        const brick = this.getBrick(args)
        if (!brick) return null

        if (
            [EnumBrickType.Glass, EnumBrickType.GlassBroken].includes(
                brick.index
            )
        ) {
            brick.index++
        } else if (brick.index !== EnumBrickType.Unbreakable) {
            brick.dead = true
            this.painter.remove(brick.sprite)
            this.count--
        }
        return brick.hitTest(args)
    }

    private getBrick({ x, y }: { x: number; y: number }) {
        const row = Math.floor(12.5 - y)
        const bricks = this.bricks[row]
        if (!bricks) return null

        for (const brick of bricks) {
            if (
                !brick.dead &&
                Math.abs(brick.x - x) < 1 &&
                Math.abs(brick.y - y) < 0.5
            )
                return brick
        }
        return null
    }
}
