import {
    type TgdAnimation,
    type TgdContext,
    TgdEvent,
    TgdPainterLogic,
    tgdCalcDegToRad,
    tgdCalcMix,
} from "@tolokoban/tgd"
import { isNumber } from "@tolokoban/type-guards"
import { byId } from "@/utils/dom"
import { Inputs } from "../inputs"
import { ArkanoidLevels } from "../levels"
import { EnumBonusType } from "./../levels/types"
import type { PainterBalls } from "../painters/balls"
import type { PainterBonuses } from "../painters/bonuses"
import type { PainterBricks } from "../painters/bricks"
import type { PainterPad } from "../painters/pad"
import { EnumBallType, type LogicBall } from "./balls/ball"
import { LogicBalls } from "./balls/balls"
import { BonusState } from "./bonus-state"
import { LogicBonuses } from "./bonuses/bonuses"
import { LogicBricks } from "./bricks"
import { EnumBrickType } from "./bricks/brick"
import { LogicPad } from "./pad"

export interface LogicOptions {
    levelIndex: number
    balls: PainterBalls
    bricks: PainterBricks
    bonuses: PainterBonuses
    pad: PainterPad
}

export class Logic extends TgdPainterLogic {
    public readonly levelIndex: number
    public readonly eventVictory = new TgdEvent()

    private readonly pad: LogicPad
    private readonly balls: LogicBalls
    private readonly bricks: LogicBricks
    private readonly bonuses: LogicBonuses
    private readonly inputs: Inputs
    private animLargePad: TgdAnimation[] = []
    private animSmallPad: TgdAnimation[] = []
    private readonly bonusStickyPad = new BonusState({
        duration: 15,
        onStop: () => {
            this.balls.unstick()
        },
    })
    private readonly bonusBurningBall = new BonusState({
        duration: 10,
        onStart: () => this.balls.burn(true),
        onStop: () => this.balls.burn(false),
    })
    private readonly bonusLargePad = new BonusState({
        duration: 15,
        onStart: () => {
            const scale = this.pad.scale
            this.context.animCancelArray(this.animLargePad)
            this.context.animCancelArray(this.animSmallPad)
            this.animLargePad = this.context.animSchedule({
                duration: 1,
                action: (t: number) => {
                    this.pad.scale = tgdCalcMix(scale, 2, t)
                },
            })
        },
        onStop: () => {
            const scale = this.pad.scale
            this.context.animCancelArray(this.animLargePad)
            this.context.animCancelArray(this.animSmallPad)
            this.animLargePad = this.context.animSchedule({
                duration: 1,
                action: (t: number) => {
                    this.pad.scale = tgdCalcMix(scale, 1, t)
                },
            })
        },
    })
    private readonly bonusSmallPad = new BonusState({
        duration: 20,
        onStart: () => {
            const scale = this.pad.scale
            this.context.animCancelArray(this.animLargePad)
            this.context.animCancelArray(this.animSmallPad)
            this.animSmallPad = this.context.animSchedule({
                duration: 1,
                action: (t: number) => {
                    this.pad.scale = tgdCalcMix(scale, 0.5, t)
                },
            })
        },
        onStop: () => {
            const scale = this.pad.scale
            this.context.animCancelArray(this.animLargePad)
            this.context.animCancelArray(this.animSmallPad)
            this.animSmallPad = this.context.animSchedule({
                duration: 1,
                action: (t: number) => {
                    this.pad.scale = tgdCalcMix(scale, 1, t)
                },
            })
        },
    })

    private _lifes = 3

    constructor(
        private readonly context: TgdContext,
        options: LogicOptions
    ) {
        super((time: number, delay: number) => this.update(time, delay))
        this.levelIndex = options.levelIndex
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
            this.bonuses.reset()
        })
        this.balls.reset()
        this.bonuses = new LogicBonuses(options.bonuses)
        this.bricks = new LogicBricks(options.bricks)
        this.bricks.eventVictory.addListener(this.handleLevelVictory)
        this.bricks.eventBonus.addListener((bonus) => this.bonuses.add(bonus))
        this.bricks.level =
            ArkanoidLevels[options.levelIndex % ArkanoidLevels.length]
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

    private readonly update = (time: number, delta: number) => {
        this.bonusStickyPad.update(time)
        this.bonusBurningBall.update(time)
        this.bonusLargePad.update(time)
        this.bonusSmallPad.update(time)

        const { pad, balls, bricks, bonuses, inputs } = this
        inputs.update(time, delta)
        if (inputs.fire || inputs.gamepad.buttonAorB) balls.unstick()
        pad.update(time, delta)
        balls.update(time, delta)
        for (const ball of balls.list()) {
            const anglePad = collideWithPad(ball, pad)
            if (isNumber(anglePad)) {
                ball.bounce(anglePad)
                if (this.bonusStickyPad.active) ball.stick()
            } else {
                const hit = bricks.hitTest(ball)
                if (hit) {
                    const { normalAngle, brick } = hit
                    if (
                        brick.index === EnumBrickType.Unbreakable ||
                        ball.type === EnumBallType.Normal
                    ) {
                        ball.bounce(normalAngle)
                    }
                }
            }
        }
        bonuses.update(time, delta)
        this.checkBonuses()
    }

    private checkBonuses() {
        const { pad, bonuses } = this
        const bonus = bonuses.hitTest(pad.x, pad.y, 2 * pad.scale, 0.5)
        switch (bonus) {
            case EnumBonusType.TripleBall:
                this.balls.triple()
                break
            case EnumBonusType.StickyPad:
                this.bonusStickyPad.start()
                break
            case EnumBonusType.BurningBall:
                this.bonusBurningBall.start()
                break
            case EnumBonusType.LargePad:
                this.bonusLargePad.start()
                break
            case EnumBonusType.SmallPad:
                this.bonusSmallPad.start()
                break
        }
    }

    private handleLevelVictory = () => {
        this.eventVictory.dispatch()
    }
}

function collideWithPad(ball: LogicBall, pad: LogicPad): number | null {
    const { x, y, dy } = ball
    if (dy >= 0 || Math.abs(y - pad.y) > 0.5) return null

    const dist = x - pad.x
    const alpha = dist / (2 * pad.scale)
    if (Math.abs(alpha) > 1) return null

    const ang = 30
    const normalAngleDeg = ang * alpha ** 3
    return tgdCalcDegToRad(-normalAngleDeg)
}
