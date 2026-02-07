import {
    type TgdAnimation,
    type TgdContext,
    tgdCalcMix,
    tgdEasingFunctionInOutCubic,
} from "@tolokoban/tgd"
import { LogicPad } from "../pad"
import { BonusState } from "./bonus-state"

const DURATION = 8

export class BonusSlow extends BonusState {
    private speedStart = 0
    private speedEnd = 0
    private animations: TgdAnimation[] = []

    constructor(context: TgdContext, pad: LogicPad) {
        super({
            duration: DURATION,
            onStart: () => {
                this.speedStart = pad.speed / 4
                this.speedEnd = LogicPad.speed
                context.animCancelArray(this.animations)
                this.animations = context.animSchedule({
                    duration: DURATION,
                    action: (alpha) => {
                        pad.speed = tgdCalcMix(
                            this.speedStart,
                            this.speedEnd,
                            alpha
                        )
                    },
                    easingFunction: tgdEasingFunctionInOutCubic,
                })
            },
            onStop: () => {
                pad.speed = LogicPad.speed
            },
        })
    }
}
