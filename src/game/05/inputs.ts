import { TgdContext } from "@tolokoban/tgd"

export class Inputs {
    constructor(private readonly context: TgdContext) {}

    get right() {
        return this.context.inputs.keyboard.isDown("ArrowRight")
    }

    get left() {
        return this.context.inputs.keyboard.isDown("ArrowLeft")
    }
}
