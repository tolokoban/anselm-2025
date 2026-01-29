import { tgdCalcClamp } from "@tolokoban/tgd"
import type { Inputs } from "../inputs"
import type { PainterPad } from "../painters/pad"

export class LogicPad {
    public speed = 15

    constructor(
        private readonly inputs: Inputs,
        private readonly pad: PainterPad
    ) {}

    reset() {
        const { pad } = this
        pad.x = 0
        pad.y = -12
        pad.scale = 1
    }

    update(time: number, delay: number) {
        const { inputs, speed } = this
        if (inputs.right) this.x += speed * delay
        if (inputs.left) this.x -= speed * delay
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
