import type { Inputs } from "../inputs"
import type { PainterPad } from "../painters/pad"

export class PadLogic {
    public speed = 15

    constructor(
        private readonly inputs: Inputs,
        private readonly pad: PainterPad
    ) {}

    get x() {
        return this.pad.x
    }

    get y() {
        return this.pad.y
    }

    update(time: number, delay: number) {
        const { inputs, pad, speed } = this
        if (inputs.right) pad.x += speed * delay
        if (inputs.left) pad.x -= speed * delay
    }
}
