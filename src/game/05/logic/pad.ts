import { tgdCalcClamp, tgdCalcMapRange } from "@tolokoban/tgd"
import type { Inputs } from "../inputs"
import type { PainterPad } from "../painters/pad"

export class LogicPad {
    public speed = 16

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

    update(_time: number, delay: number) {
        const { inputs } = this
        const speed = this.speed * delay
        if (inputs.right) this.x += speed
        if (inputs.left) this.x -= speed
        this.x += speed * inputs.gamepad.stickV1
        if (inputs.isTouching) {
            this.x = tgdCalcMapRange(inputs.pointerX, -1, +1, -13, +13)
        }
    }

    get x() {
        return this.pad.x
    }
    set x(value: number) {
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
