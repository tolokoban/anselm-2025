import { TgdEvent } from "@tolokoban/tgd"

import type { ArkanoidLevel, EnumBonusType } from "../../levels/types"
import type { PainterBricks } from "../../painters/bricks"
import { LogicBalls } from "../balls"
import { LogicBall } from "../balls/ball"
import { Sound } from "../sound/sound"
import { EnumBrickType, type LogicBrick } from "./brick"
import { parseLevel } from "./parse-level"

const NORMAL_UP = 0
const NORMAL_DOWN = Math.PI
const NORMAL_LEFT = +Math.PI / 2
const NORMAL_RIGHT = -Math.PI / 2

interface InternalHit {
    brick: LogicBrick
    normalAngle: number
    t: number
}

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

    forEachBrick(callback: (brick: LogicBrick) => void) {
        const set = new Set<LogicBrick>()
        for (const row of this.bricks) {
            for (const brick of row) {
                if (set.has(brick)) continue

                if (brick) {
                    callback(brick)
                    set.add(brick)
                }
            }
        }
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
        let hit: InternalHit | null = null
        let hitVertical: InternalHit | null = null
        let hitHorizontal: InternalHit | null = null
        const ballRadius = LogicBalls.RADIUS
        const steps = Math.max(
            Math.ceil(Math.abs(args.dx) / ballRadius),
            Math.ceil(Math.abs(args.dy) / ballRadius),
        )
        if (steps === 0) return null
        const x = args.x - args.dx
        const y = args.y - args.dy
        const dx = args.dx / steps
        const dy = args.dy / steps
        if (dy > 0) {
            // Going up
            hitVertical = this.hitTestUp(x, y, dx, dy, ballRadius, steps)
        } else if (dy < 0) {
            // Going down
            hitVertical = this.hitTestDown(x, y, dx, dy, ballRadius, steps)
        }
        if (dx > 0) {
            // Going right
            hitHorizontal = this.hitTestRight(x, y, dx, dy, ballRadius, steps)
        } else if (dx < 0) {
            // Going left
            hitHorizontal = this.hitTestLeft(x, y, dx, dy, ballRadius, steps)
        }
        if (!hitVertical && !hitHorizontal) return null

        if (hitVertical && hitHorizontal) {
            hit = hitVertical.t < hitHorizontal.t ? hitVertical : hitHorizontal
        } else if (hitHorizontal) hit = hitHorizontal
        else hit = hitVertical
        if (hit) {
            args.x += (hit.t - 1) * args.dx
            args.y += (hit.t - 1) * args.dy
            this.bumpBick(hit.brick)
            return hit
        }
        return null
    }

    private hitTestLeft(
        x0: number,
        y0: number,
        dx: number,
        dy: number,
        ballRadius: number,
        steps: number,
    ): InternalHit | null {
        let x = x0 - ballRadius
        let y = y0
        for (let step = 0; step < steps; step++) {
            const col0 = this.toCol(x)
            x += dx
            y += dy
            const col1 = this.toCol(x)
            if (col0 === col1) continue

            const row1 = this.toRow(y)
            const brick = this.getBrick(col1, row1)
            if (brick && x > brick.x) {
                return {
                    brick,
                    normalAngle: NORMAL_RIGHT,
                    t: (step + 1 - (x - brick.right) / dx) / steps,
                }
            }
        }
        return null
    }

    private hitTestRight(
        x0: number,
        y0: number,
        dx: number,
        dy: number,
        ballRadius: number,
        steps: number,
    ): InternalHit | null {
        let x = x0 + ballRadius
        let y = y0
        for (let step = 0; step < steps; step++) {
            const col0 = this.toCol(x)
            x += dx
            y += dy
            const col1 = this.toCol(x)
            if (col0 === col1) continue

            const row1 = this.toRow(y)
            const brick = this.getBrick(col1, row1)
            if (brick && x < brick.x) {
                return {
                    brick,
                    normalAngle: NORMAL_LEFT,
                    t: (step + 1 - (x - brick.left) / dx) / steps,
                }
            }
        }
        return null
    }

    private hitTestUp(
        x0: number,
        y0: number,
        dx: number,
        dy: number,
        ballRadius: number,
        steps: number,
    ): InternalHit | null {
        let x = x0
        let y = y0 + ballRadius
        for (let step = 0; step < steps; step++) {
            const row0 = this.toRow(y)
            x += dx
            y += dy
            const row1 = this.toRow(y)
            if (row0 === row1) continue

            const col1 = this.toCol(x)
            const brick = this.getBrick(col1, row1)
            if (brick) {
                const t = (step + 1 - (y - brick.bottom) / dy) / steps
                return {
                    t,
                    brick,
                    normalAngle: NORMAL_DOWN,
                }
            }
        }
        return null
    }

    private hitTestDown(
        x0: number,
        y0: number,
        dx: number,
        dy: number,
        ballRadius: number,
        steps: number,
    ): InternalHit | null {
        let x = x0
        let y = y0 - ballRadius
        for (let step = 0; step < steps; step++) {
            const row0 = this.toRow(y)
            x += dx
            y += dy
            const row1 = this.toRow(y)
            if (row0 === row1) continue

            const col1 = this.toCol(x)
            const brick = this.getBrick(col1, row1)
            if (brick) {
                const t = (step + 1 - (y - brick.top) / dy) / steps
                return {
                    t,
                    brick,
                    normalAngle: NORMAL_UP,
                }
            }
        }
        return null
    }

    private bumpBick(brick: LogicBrick) {
        if ([EnumBrickType.Glass, EnumBrickType.GlassBroken].includes(brick.index)) {
            Sound.glass.play()
            brick.index++
        } else if (brick.index !== EnumBrickType.Unbreakable) {
            Sound.pop.play()
            brick.dead = true
            if (typeof brick.bonus === "number") {
                this.eventBonus.dispatch({
                    type: brick.bonus,
                    x: brick.x,
                    y: brick.y,
                })
            }
            this.painter.remove(brick.sprite)
            this.count--
        } else {
            Sound.unbreakable.play()
        }
    }

    public toLeftX(col: number) {
        return col - 13
    }

    public toRightX(col: number) {
        return col - 12
    }

    /**
     * @returns Y of the top edge of the brick at this `row`.
     */
    public toTopY(row: number) {
        return 13 - row
    }

    /**
     * @returns Y of the bottom edge of the brick at this `row`.
     */
    public toBottomY(row: number) {
        return 12 - row
    }

    public toCol(x: number) {
        return Math.floor(x + 13)
    }

    public toRow(y: number) {
        return Math.floor(13 - y)
    }

    public toColRow(x: number, y: number): [col: number, row: number] {
        return [this.toCol(x), this.toRow(y)]
    }

    public getBrick(col: number, row: number): LogicBrick | null {
        const bricks = this.bricks[row]
        if (!bricks) return null

        const brick = bricks[col]
        if (!brick) return null

        return brick.dead ? null : brick
    }
}
