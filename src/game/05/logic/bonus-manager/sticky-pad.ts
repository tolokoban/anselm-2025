import type { LogicBalls } from "../balls"
import { BonusState } from "./bonus-state"

export class BonusStickyPad extends BonusState {
    constructor(balls: LogicBalls) {
        super({
            duration: 15,
            onStop: () => {
                balls.unstick()
            },
        })
    }
}
