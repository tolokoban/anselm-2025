import type { PainterBalls } from "../painters/balls"
import type { PainterBricks } from "../painters/bricks"
import type { PainterPad } from "../painters/pad"
import { EnumHitResult } from "../types"

export class BallsLogic {
    constructor(
        private readonly balls: PainterBalls,
        private readonly bricks: PainterBricks,
        private readonly pad: PainterPad
    ) {}

    update(time: number, delay: number) {
        this.balls.peformHitTest(
            (args: { x: number; y: number; dx: number; dy: number }) => {
                const bricksHit = this.bricks.hit(args)
                if (bricksHit) return bricksHit

                const { x, y, dx, dy } = args
                // Walls
                if (x > 13 && dx > 0)
                    return {
                        type: EnumHitResult.Wall,
                        normalAngleDeg: -90,
                    }
                if (x < -13 && dx < 0)
                    return {
                        type: EnumHitResult.Wall,
                        normalAngleDeg: 90,
                    }
                if (y > 13 && dy > 0)
                    return {
                        type: EnumHitResult.Wall,
                        normalAngleDeg: 180,
                    }
                if (y < -15 && dy < 0)
                    return {
                        type: EnumHitResult.Wall,
                        normalAngleDeg: 0,
                    }
                // Pad
                const padHit = this.pad.hit(x, y, dx, dy)
                if (padHit) return padHit

                return null
            }
        )
    }
}
