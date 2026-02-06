import { tgdCalcClamp } from "@tolokoban/tgd"
import { PainterLaser } from "../painters/laser/laser"
import { LogicPad } from "./pad"
import { LogicBricks } from "./bricks"

export class LogicLaser {
    public speed = 32
    public enabled = false

    private lastTime = 0
    /**
     * We alternate the spawn of laser from left (-1) ro right (+1).
     */
    private direction = +1

    constructor(
        private readonly pad: LogicPad,
        private readonly laser: PainterLaser
    ) {}

    update(time: number, delay: number) {
        const { laser } = this
        const speed = this.speed * delay
        laser.forEach((sprite) => {
            sprite.y += speed
            sprite.dy = speed
            if (sprite.y > 14) laser.remove(sprite)
        })
        if (!this.enabled || time - this.lastTime < 0.1) return

        this.lastTime = time
        laser.add(
            this.pad.x + this.direction * 1.5 * this.pad.scale,
            this.pad.y
        )
        this.direction = -this.direction
    }

    hitTest(bricks: LogicBricks) {
        this.laser.forEach((sprite) => {
            const yFinal = sprite.y
            const steps = Math.floor(sprite.dy)
            let y = yFinal - steps
            for (let step = 0; step < steps; step++) {
                sprite.y = y
                y++
                if (bricks.hitTest(sprite)) {
                    this.laser.remove(sprite)
                    return
                }
            }
            sprite.y = yFinal
            if (bricks.hitTest(sprite)) {
                this.laser.remove(sprite)
                return
            }
        })
    }

    get x() {
        return this.pad.x
    }
    private set x(value: number) {
        const { pad } = this
        const size = 2 * pad.scale
        pad.x = tgdCalcClamp(value, -13 + size, 13 - size)
    }

    get y() {
        return this.pad.y
    }

    get scale() {
        return this.pad.scale
    }
    set scale(v: number) {
        this.pad.scale = v
    }
}
