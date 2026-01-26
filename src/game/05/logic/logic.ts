import { type TgdContext, TgdPainterLogic } from "@tolokoban/tgd"
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

    constructor(
        context: TgdContext,
        private readonly options: LogicOptions
    ) {
        super((time: number, delay: number) => this.update(time, delay))
        const inputs = new Inputs(context)
        this.pad = new PadLogic(inputs, options.pad)
        this.balls = new BallsLogic(options.balls, options.bricks, options.pad)
    }

    private readonly update = (time: number, delay: number) => {
        this.pad.update(time, delay)
        this.balls.update(time, delay)
    }
}
