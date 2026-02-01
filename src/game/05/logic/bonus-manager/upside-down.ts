import {
    type TgdAnimation,
    type TgdCamera,
    type TgdContext,
    tgdCalcMix,
    tgdEasingFunctionInOutCubic,
} from "@tolokoban/tgd"
import { BonusState } from "./bonus-state"

export class BonusUpsideDown extends BonusState {
    private angle = 0
    private anim: TgdAnimation[] = []

    constructor(context: TgdContext, camera: TgdCamera) {
        super({
            duration: 20,
            onStart: () => {
                context.animCancelArray(this.anim)
                const from = this.angle
                const to = 180
                this.anim = context.animSchedule({
                    duration: 0.3,
                    action: (t: number) => {
                        this.angle = tgdCalcMix(from, to, t)
                        camera.transfo.setEulerRotation(0, 0, this.angle)
                    },
                    easingFunction: tgdEasingFunctionInOutCubic,
                })
            },
            onStop: () => {
                context.animCancelArray(this.anim)
                const from = this.angle
                const to = 0
                this.anim = context.animSchedule({
                    duration: 0.3,
                    action: (t: number) => {
                        this.angle = tgdCalcMix(from, to, t)
                        camera.transfo.setEulerRotation(0, 0, this.angle)
                    },
                    easingFunction: tgdEasingFunctionInOutCubic,
                })
            },
        })
    }
}
