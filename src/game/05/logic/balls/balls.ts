import {
    TgdConsole,
    TgdEvent,
    tgdCalcDegToRad,
    tgdCalcRadToDeg,
} from "@tolokoban/tgd"
import type { PainterBalls } from "../../painters/balls"
import { EnumBallType, LogicBall } from "./ball"

export class LogicBalls {
    public readonly eventDead = new TgdEvent()

    private readonly balls: LogicBall[] = []

    constructor(
        private readonly painter: PainterBalls,
        private readonly ask: {
            padX(): number
            padY(): number
        }
    ) {}

    burn(enabled: boolean) {
        for (const ball of this.balls) {
            ball.type = enabled ? EnumBallType.Burning : EnumBallType.Normal
        }
    }

    list() {
        return [...this.balls]
    }

    /**
     * Multiply the number of balls by 3.
     */
    triple() {
        if (this.balls.length > 3) return

        for (const ball of this.list()) {
            this.copyBall(ball, -10)
            this.copyBall(ball, +10)
        }
    }

    reset() {
        for (const ball of this.list()) {
            this.remove(ball)
        }
        this.painter.clear()
        const ball = this.add()
        ball.y = -50
        ball.stick()
    }

    add() {
        const ball = new LogicBall(this.painter.add(), this.ask)
        this.balls.push(ball)
        return ball
    }

    remove(ball: LogicBall) {
        const { balls } = this
        const index = balls.indexOf(ball)
        if (index === -1) return

        this.painter.remove(ball.sprite)
        balls.splice(index, 1)
        if (balls.length === 0) this.eventDead.dispatch()
    }

    unstick() {
        for (const ball of this.balls) ball.unstick()
    }

    update(time: number, delta: number) {
        for (const ball of [...this.balls]) {
            this.wallsHitTest(ball)
            ball.update(time, delta)
        }
    }

    private copyBall(ball: LogicBall, angleShiftDeg: number): LogicBall {
        const newBall = this.add()
        newBall.angle = ball.angle + tgdCalcDegToRad(angleShiftDeg)
        newBall.type = ball.type
        newBall.x = ball.x
        newBall.y = ball.y
        newBall.unstick()
        return newBall
    }

    private wallsHitTest(ball: LogicBall) {
        const { x, y, dx, dy } = ball
        if (x > +13 && dx > 0) return ball.bounce(-Math.PI / 2)
        if (x < -13 && dx < 0) return ball.bounce(+Math.PI / 2)
        if (y > +13 && dy > 0) return ball.bounce(Math.PI)
        if (y < -16 && dy < 0) return this.remove(ball)
    }

    private debug() {
        const out = new TgdConsole()
        let index = 0
        for (const ball of this.list()) {
            out.add(`#${index++} `, { bold: true })
                .add(
                    `(${ball.x.toFixed(1)}, ${ball.y.toFixed(1)})   ${Math.round(tgdCalcRadToDeg(ball.angle))}°   speed: ${ball.speed}`
                )
                .nl()
        }
        out.debug()
    }
}
