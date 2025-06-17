import {
    TgdContext,
    TgdDataGlb,
    TgdPainter,
    TgdPainterGroup,
} from "@tolokoban/tgd"
import { Obstacle } from "./obstacle"

export class Obstacles extends TgdPainterGroup {
    private readonly obtacles: Obstacle[]

    constructor(context: TgdContext, asset: TgdDataGlb) {
        super()
        this.name = "Obstacles"
        this.obtacles = [
            new Obstacle(context, asset),
            new Obstacle(context, asset, 0.5),
            new Obstacle(context, asset, 0.25),
            new Obstacle(context, asset, 0.75),
        ]
        this.add(...this.obtacles)
    }

    set speed(value: number) {
        for (const obstacle of this.obtacles) {
            obstacle.speed = value
        }
    }

    set time0(value: number) {
        for (const obstacle of this.obtacles) {
            obstacle.time0 = value
        }
    }

    hitTest({ x, y, z }: { x: number; y: number; z: number }): boolean {
        for (const obstacle of this.obtacles) {
            if (obstacle.hitTest({ x, y, z })) return true
        }
        return false
    }
}
