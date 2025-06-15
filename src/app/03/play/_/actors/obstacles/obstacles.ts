import { TgdContext, TgdDataGlb, TgdPainter } from "@tolokoban/tgd"
import { Obstacle } from "./obstacle"

export class Obstacles extends TgdPainter {
    private readonly obtacles: Obstacle[]

    constructor(context: TgdContext, asset: TgdDataGlb) {
        super()
        this.obtacles = [
            new Obstacle(context, asset),
            new Obstacle(context, asset, 0.5),
            new Obstacle(context, asset, 0.25),
            new Obstacle(context, asset, 0.75),
        ]
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

    delete(): void {
        for (const obstacle of this.obtacles) {
            obstacle.delete()
        }
    }

    paint(time: number, delay: number): void {
        for (const obstacle of this.obtacles) {
            obstacle.paint(time, delay)
        }
    }
}
