import { TgdEvent } from "@tolokoban/tgd"
import type { PainterBalls } from "../../painters/balls"
import { LogicBall } from "./ball"

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

    list() {
        return [...this.balls]
    }

    reset() {
        for (const ball of [...this.balls]) {
            this.remove(ball)
        }
        const ball = new LogicBall(this.painter.add(), this.ask)
        this.balls.push(ball)
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

    private wallsHitTest(ball: LogicBall) {
        const { x, y, dx, dy } = ball
        if (x > +13 && dx > 0) return ball.bounce(-Math.PI / 2)
        if (x < -13 && dx < 0) return ball.bounce(+Math.PI / 2)
        if (y > +13 && dy > 0) return ball.bounce(Math.PI)
        if (y < -16 && dy < 0) return this.remove(ball)
    }
}
