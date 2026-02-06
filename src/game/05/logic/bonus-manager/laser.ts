import { LogicLaser } from "../laser"
import { BonusState } from "./bonus-state"

export class BonusLaser extends BonusState {
    private counter = 0

    constructor(laser: LogicLaser) {
        super({
            duration: 10,
            onStart: () => {
                this.counter++
                laser.enabled = true
            },
            onStop: () => {
                this.counter--
                if (this.counter <= 0) {
                    laser.enabled = false
                }
            },
        })
    }
}
