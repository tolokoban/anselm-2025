import { TgdEvent } from "@tolokoban/tgd"
import type { PainterBalls } from "../painters/balls"
import type { PainterBricks } from "../painters/bricks"
import type { PainterPad } from "../painters/pad"
import { EnumHitResult, type HitResult } from "../types"
import type { PadLogic } from "./pad"

export class BallsLogic {
    public readonly eventDead = new TgdEvent()

    constructor(
        private readonly balls: PainterBalls,
        private readonly bricks: PainterBricks,
        private readonly pad: PainterPad
    ) {
        balls.eventDead.addListener(() => this.eventDead.dispatch())
    }

    reset() {
        this.balls.reset()
    }

    releaseBalls() {
        this.balls.releaseBalls()
    }

    update(time: number, delay: number, pad: PadLogic) {
        this.balls.setPadXY(pad.x, pad.y)
        this.balls.peformHitTest(
            (args: {
                x: number
                y: number
                dx: number
                dy: number
            }): HitResult | null => {
                const bricksHit = this.bricks.hit(args)
                if (bricksHit) return bricksHit

                const { x, y, dx, dy } = args
                // Walls
                if (x > 13 && dx > 0)
                    return {
                        type: EnumHitResult.Wall,
                        normalAngleDeg: -90,
                        x: 13,
                        y,
                    }
                if (x < -13 && dx < 0)
                    return {
                        type: EnumHitResult.Wall,
                        normalAngleDeg: 90,
                        x: -13,
                        y,
                    }
                if (y > 13 && dy > 0)
                    return {
                        type: EnumHitResult.Wall,
                        normalAngleDeg: 180,
                        x,
                        y: -13,
                    }
                if (y < -15 && dy < 0)
                    return {
                        type: EnumHitResult.Death,
                        normalAngleDeg: 0,
                        x,
                        y: -15,
                    }
                // Pad
                const padHit = this.pad.hit(x, y, dx, dy)
                if (padHit) return padHit

                return null
            }
        )
    }
}
