import { type TgdAnimation, type TgdContext, tgdCalcMix } from "@tolokoban/tgd"
import type { LogicPad } from "../pad"
import { BonusState } from "./bonus-state"

export class BonusResizePad extends BonusState {
    constructor(
        context: TgdContext,
        pad: LogicPad,
        animations: { resize: TgdAnimation[] },
        targetScale: number
    ) {
        super({
            duration: 20,
            onStart: () => {
                const scale = pad.scale
                context.animCancelArray(animations.resize)
                animations.resize = context.animSchedule({
                    duration: 1,
                    action: (t: number) => {
                        pad.scale = tgdCalcMix(scale, targetScale, t)
                    },
                })
            },
            onStop: () => {
                const scale = pad.scale
                context.animCancelArray(animations.resize)
                animations.resize = context.animSchedule({
                    duration: 1,
                    action: (t: number) => {
                        pad.scale = tgdCalcMix(scale, 1, t)
                    },
                })
            },
        })
    }
}
