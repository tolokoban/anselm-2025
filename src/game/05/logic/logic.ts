import { byId } from "@/utils/dom"
import {
    tgdCalcDegToRad,
    type TgdContext,
    TgdPainterLogic,
} from "@tolokoban/tgd"
import { Inputs } from "../inputs"
import type { PainterBalls } from "../painters/balls"
import type { PainterBricks } from "../painters/bricks"
import type { PainterPad } from "../painters/pad"
import { LogicBalls } from "./balls/balls"
import { LogicPad } from "./pad"
import { LogicBall } from "./balls/ball"
import { isNumber } from "@tolokoban/type-guards"
import { LogicBricks } from "./bricks"
import { ArkanoidLevels } from "../levels"

export interface LogicOptions {
    balls: PainterBalls
    bricks: PainterBricks
    pad: PainterPad
}

export class Logic extends TgdPainterLogic {
    private readonly pad: LogicPad
    private readonly balls: LogicBalls
    private readonly bricks: LogicBricks
    private readonly inputs: Inputs
    private _lifes = 3
    private levelIndex = 0

    constructor(context: TgdContext, options: LogicOptions) {
        super((time: number, delay: number) => this.update(time, delay))
        this.lifes = 3
        const inputs = new Inputs(context)
        this.inputs = inputs
        this.pad = new LogicPad(inputs, options.pad)
        this.balls = new LogicBalls(options.balls, {
            padX: () => this.pad.x,
            padY: () => this.pad.y,
        })
        this.balls.eventDead.addListener(() => {
            this.lifes--
            this.pad.reset()
            this.balls.reset()
        })
        this.balls.reset()
        this.bricks = new LogicBricks(options.bricks)
        this.bricks.eventVictory.addListener(this.handleLevelVictory)
        this.bricks.level = ArkanoidLevels[0]
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
        const { pad, balls, bricks, inputs } = this
        inputs.update(time, delay)
        if (inputs.fire) balls.unstick()
        pad.update(time, delay)
        balls.update(time, delay)
        for (const ball of balls.list()) {
            const anglePad = collideWithPad(ball, pad)
            if (isNumber(anglePad)) ball.bounce(anglePad)
            else {
                const angleBrick = bricks.hitTest(ball)
                if (isNumber(angleBrick)) {
                    ball.bounce(angleBrick)
                }
            }
        }
    }

    private handleLevelVictory = () => {
        this.levelIndex = (this.levelIndex + 1) % ArkanoidLevels.length
        this.balls.reset()
        this.pad.reset()
        this.bricks.level = ArkanoidLevels[this.levelIndex]
    }
}

function collideWithPad(ball: LogicBall, pad: LogicPad): number | null {
    const { x, y, dy } = ball
    if (dy >= 0 || Math.abs(y - pad.y) > 0.5) return null

    const dist = x - pad.x
    const alpha = dist / (2 * pad.scale)
    if (Math.abs(alpha) > 1) return null

    const ang = 30
    const normalAngleDeg = ang * Math.pow(alpha, 3)
    return tgdCalcDegToRad(-normalAngleDeg)
}
