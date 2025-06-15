import {
    tgdCalcClamp,
    TgdContext,
    TgdDataGlb,
    tgdMakeMeshGlbPainter,
    TgdPainterNode,
} from "@tolokoban/tgd"

export class Saucer {
    public readonly node: TgdPainterNode
    public readonly painterOpaque: TgdPainterNode

    private _x = 0
    private angle = 0
    private speed = 0

    constructor(
        private readonly context: TgdContext,
        data: TgdDataGlb
    ) {
        this.painterOpaque = tgdMakeMeshGlbPainter({
            data,
            context,
            node: "Saucer",
        }).painter
        this.node = new TgdPainterNode({
            children: [
                new TgdPainterNode({
                    children: [this.painterOpaque],
                    logic(time) {
                        const { orientation } = this.transfo
                        orientation.reset()
                        this.transfo.orbitAroundX(0.2 * Math.sin(time * 3.7))
                        this.transfo.orbitAroundY(time)
                    },
                }),
            ],
            logic: (time, delay) => {
                const speedFactor = 2.5
                const kb = this.context.inputs.keyboard
                const pt = this.context.inputs.pointer
                let angleDelta = 0
                const angleSpeed = 90
                if (
                    kb.isDown("ArrowRight") ||
                    pt.isTouching(({ x }) => x > 0)
                ) {
                    this.speed += delay
                    angleDelta = -delay * angleSpeed
                } else if (
                    kb.isDown("ArrowLeft") ||
                    pt.isTouching(({ x }) => x < 0)
                ) {
                    this.speed -= delay
                    angleDelta = +delay * angleSpeed
                } else {
                    this.angle *= 0.9
                    this.speed *= 0
                }
                this.angle = tgdCalcClamp(this.angle + angleDelta, -60, +60)
                this.x += this.speed * speedFactor * delay
                if (
                    (this.x === -1 && this.speed < 0) ||
                    (this.x === +1 && this.speed > 0)
                ) {
                    // Bouncing.
                    this.speed = -this.speed
                }
                this.node.transfo.setEulerRotation(0, 0, this.angle)
            },
        })
        this.node.transfo.setPosition(0, 0, 0)
    }

    get x() {
        return this._x
    }
    private set x(v: number) {
        const [s] = this.node.transfo.scale
        this._x = tgdCalcClamp(v, -1, +1)
        const x = 4 * this._x
        this.node.transfo.setPosition(x / s, 0, 0)
        const [, y, z] = this.context.camera.transfo.position
        this.context.camera.transfo.setPosition(x * 1.2, y, z)
    }
}
