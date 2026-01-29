import {
    tgdCalcDegToRad,
    tgdCalcModuloDiscrete,
    TgdSprite,
} from "@tolokoban/tgd"

export enum EnumBallType {
    Normal,
    Burning,
}

export class LogicBall {
    /** Radians */
    public angle = 0
    public speed = 10
    public type = EnumBallType.Normal

    private _dx = 0
    private _dy = 0
    private stuck = true
    private stickyShift = 0

    constructor(
        public readonly sprite: TgdSprite,
        private readonly ask: {
            padX(): number
            padY(): number
        }
    ) {
        this.angle = tgdCalcDegToRad(-30)
    }

    stick() {
        this.stickyShift = this.x - this.ask.padX()
        this.stuck = true
    }

    unstick() {
        this.stuck = false
    }

    /**
     * @param normalAngle Radians
     */
    bounce(normalAngle: number) {
        this.angle = 2 * normalAngle - (this.angle + Math.PI)
    }

    get x() {
        return this.sprite.x
    }
    set x(v: number) {
        this.sprite.x = v
    }

    get y() {
        return this.sprite.y
    }
    set y(v: number) {
        this.sprite.y = v
    }

    get dx() {
        return this._dx
    }

    get dy() {
        return this._dy
    }

    /**
     * @param delta Seconds
     */
    update(time: number, delta: number) {
        const { angle, sprite } = this
        sprite.angle = angle
        sprite.index =
            tgdCalcModuloDiscrete(time, 0.3, 8) +
            (this.type === EnumBallType.Burning ? 8 : 0)
        if (this.stuck) {
            const { ask } = this
            const padX = ask.padX()
            const padY = ask.padY()
            this.x = padX + this.stickyShift
            this.y = padY + 0.66
        } else {
            const speed = this.speed * delta
            this._dx = speed * Math.sin(-angle)
            this._dy = speed * Math.cos(-angle)
            this.x += this._dx
            this.y += this._dy
        }
    }
}
