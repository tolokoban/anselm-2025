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
    public _x = 0

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
                const speed = 4
                const kb = this.context.inputs.keyboard
                const pt = this.context.inputs.pointer
                if (
                    kb.isDown("ArrowRight") ||
                    pt.isTouching(({ x }) => x > 0)
                ) {
                    this.x += delay * speed
                } else if (
                    kb.isDown("ArrowLeft") ||
                    pt.isTouching(({ x }) => x < 0)
                ) {
                    this.x -= delay * speed
                }
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
        console.log("🚀 [saucer] this._x =", this._x) // @FIXME: Remove this line written on 2025-04-07 at 19:24
        const x = 4 * this._x
        this.node.transfo.setPosition(x / s, 0, 0)
        const [, y, z] = this.context.camera.transfo.position
        this.context.camera.transfo.setPosition(x * 1.2, y, z)
    }
}
