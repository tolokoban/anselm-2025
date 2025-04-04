import {
    TgdContext,
    tgdMakeMeshGlbPainter,
    TgdPainterNode,
    TgdParserGLTransfertFormatBinary,
} from "@tolokoban/tgd"

export class Saucer {
    public readonly node: TgdPainterNode
    public readonly painterOpaque: TgdPainterNode
    // public readonly painterTransparent: TgdPainterNode

    constructor(context: TgdContext, data: TgdParserGLTransfertFormatBinary) {
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
        })
        this.node.transfo.setPosition(0, 0, 0)
    }
}
