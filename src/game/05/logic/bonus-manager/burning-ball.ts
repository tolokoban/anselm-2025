import type { LogicBalls } from "../balls"
import { BonusState } from "./bonus-state"

export class BonusBurningBall extends BonusState {
    constructor(balls: LogicBalls) {
        super({
            duration: 15,
            onStart: () => balls.burn(true),
            onStop: () => balls.burn(false),
        })
    }
}
