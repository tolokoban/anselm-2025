import { type TgdContext, TgdPainterLogic } from "@tolokoban/tgd"
import { byId } from "@/utils/dom"
import { Inputs } from "../inputs"
import type { PainterBalls } from "../painters/balls"
import type { PainterBricks } from "../painters/bricks"
import type { PainterPad } from "../painters/pad"
import { BallsLogic } from "./balls"
import { PadLogic } from "./pad"

export interface LogicOptions {
    balls: PainterBalls
    bricks: PainterBricks
    pad: PainterPad
}

export class Logic extends TgdPainterLogic {
    private readonly pad: PadLogic
    private readonly balls: BallsLogic
    private readonly inputs: Inputs
    private _lifes = 3

    constructor(context: TgdContext, options: LogicOptions) {
        super((time: number, delay: number) => this.update(time, delay))
        this.lifes = 3
        const inputs = new Inputs(context)
        this.inputs = inputs
        this.pad = new PadLogic(inputs, options.pad)
        this.balls = new BallsLogic(options.balls, options.bricks, options.pad)
        this.balls.eventDead.addListener(() => {
            this.lifes--
            console.log("🐞 [logic@29] this.lifes =", this.lifes) // @FIXME: Remove this line written on 2026-01-27 at 15:22
            this.balls.reset()
        })
    }

    get lifes() {
        return this._lifes
    }
    set lifes(value: number) {
        this._lifes = value
        for (const i of [1, 2, 3]) {
            const elem = byId(`life-${i}`)
            elem.style.opacity = i > value ? "0" : "1"
        }
    }

    private readonly update = (time: number, delay: number) => {
        const { pad, balls, inputs } = this
        inputs.update(time, delay)
        if (inputs.fire) balls.releaseBalls()
        pad.update(time, delay)
        balls.update(time, delay, pad)
    }
}
