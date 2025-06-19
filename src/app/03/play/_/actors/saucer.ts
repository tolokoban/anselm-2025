import {
    tgdCalcClamp,
    TgdContext,
    TgdDataGlb,
    TgdGeometryBox,
    tgdMakeMeshGlbPainter,
    TgdPainter,
    TgdPainterMesh,
    TgdPainterNode,
} from "@tolokoban/tgd"

export class Saucer extends TgdPainter {
    public readonly node: TgdPainterNode
    public readonly painterOpaque: TgdPainterNode
    public woobling = 0

    private _x = 0
    private angle = 0
    private speed = 0
    private moveRadius = 8

    constructor(
        private readonly context: TgdContext,
        data: TgdDataGlb
    ) {
        super()
        this.name = "Saucer"
        this.painterOpaque = tgdMakeMeshGlbPainter({
            data,
            context,
            node: "Saucer",
        }).painter
        const that = this
        this.node = new TgdPainterNode({
            children: [
                new TgdPainterNode({
                    children: [this.painterOpaque],
                    logic(time) {
                        const { orientation } = this.transfo
                        orientation.reset()
                        this.transfo.orbitAroundX(
                            (0.2 + that.woobling) * Math.sin(time * 3.7)
                        )
                        this.transfo.orbitAroundZ(
                            that.woobling * Math.sin(time * 1.37)
                        )
                        this.transfo.orbitAroundY(time)
                    },
                }),
            ],
        })
        this.node.transfo.setPosition(0, 0, 0)
        this.mode = "still"
        this.active = false
    }

    set mode(value: "still" | "interactive") {
        const { node } = this
        switch (value) {
            case "interactive":
                node.logic = this.logicInteractive
                break
            default:
                node.logic = undefined
                break
        }
    }

    delete() {
        this.node.delete()
    }

    paint(time: number, delay: number): void {
        this.node.paint(time, delay)
    }

    get x() {
        return this._x
    }
    private set x(v: number) {
        const x = tgdCalcClamp(v, -this.moveRadius, +this.moveRadius)
        this._x = x
        this.node.transfo.setPosition(x, 0, 0)
        const [, y, z] = this.context.camera.transfo.position
        this.context.camera.transfo.setPosition((x * 5) / this.moveRadius, y, z)
    }

    get y() {
        return this.context.camera.transfo.position.y
    }

    get z() {
        return this.context.camera.transfo.position.z
    }

    private readonly logicInteractive = (time: number, delay: number) => {
        const speedFactor = 2.5
        const kb = this.context.inputs.keyboard
        const pt = this.context.inputs.pointer
        let angleDelta = 0
        const angleSpeed = 90
        if (kb.isDown("ArrowRight") || pt.isTouching(({ x }) => x > 0)) {
            console.log("RIGHT")
            this.speed += delay
            angleDelta = -delay * angleSpeed
        } else if (kb.isDown("ArrowLeft") || pt.isTouching(({ x }) => x < 0)) {
            this.speed -= delay
            angleDelta = +delay * angleSpeed
        } else {
            this.angle *= 0.9
            this.speed *= 0
        }
        this.angle = tgdCalcClamp(this.angle + angleDelta, -60, +60)
        this.x += this.speed * speedFactor * delay * this.moveRadius
        if (
            (this.x === -this.moveRadius && this.speed < 0) ||
            (this.x === +this.moveRadius && this.speed > 0)
        ) {
            // Bouncing.
            this.speed = -this.speed
        }
        this.node.transfo.setEulerRotation(0, 0, this.angle)
    }
}
