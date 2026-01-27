import type { TgdContext } from "@tolokoban/tgd"

export class Inputs {
    private readonly pressedButtons = new Set<string>()

    constructor(private readonly context: TgdContext) {
        ;["fire", "left", "right"].forEach(this.registerButton)
    }

    update(time: number, delay: number) {}

    get right() {
        return (
            this.context.inputs.keyboard.isDown("ArrowRight") ||
            this.pressedButtons.has("right")
        )
    }

    get left() {
        return (
            this.context.inputs.keyboard.isDown("ArrowLeft") ||
            this.pressedButtons.has("left")
        )
    }

    get fire() {
        return (
            this.context.inputs.keyboard.isDown(" ") ||
            this.pressedButtons.has("fire")
        )
    }

    private readonly registerButton = (id: string) => {
        const button = globalThis.document.getElementById(`btn-${id}`)
        if (!button) throw new Error(`No button with id #btn-${id}!`)

        button.addEventListener("pointerdown", () =>
            this.pressedButtons.add(id)
        )
        button.addEventListener("pointerup", () =>
            this.pressedButtons.delete(id)
        )
        button.addEventListener("pointercancel", () =>
            this.pressedButtons.delete(id)
        )
    }
}
