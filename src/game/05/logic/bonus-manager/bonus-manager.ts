import type { TgdAnimation, TgdCamera, TgdContext } from "@tolokoban/tgd"
import { EnumBonusType } from "../../levels/types"
import type { LogicBalls } from "../balls"
import type { LogicBonuses } from "../bonuses"
import type { LogicLaser } from "../laser"
import type { LogicPad } from "../pad"
import type { BonusState } from "./bonus-state"
import { BonusBurningBall } from "./burning-ball"
import { BonusLaser } from "./laser"
import { BonusResizePad } from "./resize-pad"
import { BonusSlow } from "./slow"
import { BonusStickyPad } from "./sticky-pad"
import { BonusUpsideDown } from "./upside-down"

export class BonusManager {
    private readonly animations: { resize: TgdAnimation[] } = {
        resize: [],
    }

    private readonly bonusStickyPad: BonusState
    private readonly bonusBurningBall: BonusState
    private readonly bonusLargePad: BonusState
    private readonly bonusSmallPad: BonusState
    private readonly bonusUpsideDown: BonusState
    private readonly bonusLaser: BonusState
    private readonly bonusSlow: BonusSlow

    private readonly pad: LogicPad
    private readonly balls: LogicBalls
    private readonly bonuses: LogicBonuses

    constructor(options: {
        context: TgdContext
        camera: TgdCamera
        balls: LogicBalls
        pad: LogicPad
        bonuses: LogicBonuses
        laser: LogicLaser
    }) {
        const { context, camera, pad, balls, bonuses, laser } = options
        this.pad = pad
        this.balls = balls
        this.bonuses = bonuses
        this.bonusStickyPad = new BonusStickyPad(balls)
        this.bonusBurningBall = new BonusBurningBall(balls)
        this.bonusLargePad = new BonusResizePad(
            context,
            pad,
            this.animations,
            2
        )
        this.bonusSmallPad = new BonusResizePad(
            context,
            pad,
            this.animations,
            0.5
        )
        this.bonusUpsideDown = new BonusUpsideDown(context, camera)
        this.bonusLaser = new BonusLaser(laser)
        this.bonusSlow = new BonusSlow(context, pad)
    }

    get stickyPad() {
        return this.bonusStickyPad.active
    }

    update(time: number) {
        this.bonusStickyPad.update(time)
        this.bonusBurningBall.update(time)
        this.bonusLargePad.update(time)
        this.bonusSmallPad.update(time)
        this.bonusUpsideDown.update(time)
        this.bonusLaser.update(time)
        this.bonusSlow.update(time)

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
            case EnumBonusType.UpsideDown:
                this.bonusUpsideDown.start()
                break
            case EnumBonusType.Laser:
                this.bonusLaser.start()
                break
            case EnumBonusType.Slow:
                this.bonusSlow.start()
                break
        }
    }
}
