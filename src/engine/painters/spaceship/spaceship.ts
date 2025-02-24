import { Intention } from "@/engine/intention"
import {
    TgdContext,
    TgdDataset,
    tgdLoadImage,
    TgdPainter,
    TgdPainterState,
    TgdProgram,
    TgdTexture2D,
    TgdVertexArray,
    webglPresetBlend,
} from "@tolokoban/tgd"

import VERT from "./spaceshift.vert"
import FRAG from "./spaceshift.frag"
import SpaceshipURL from "./spaceship.webp"

export class PainterSpaceshift extends TgdPainter {
    private readonly texture: TgdTexture2D
    private readonly prg: TgdProgram
    private readonly vao: TgdVertexArray
    private scaleX = 1
    private scaleY = 1

    constructor(
        private readonly context: TgdContext,
        private readonly intention: Intention
    ) {
        super()
        const texture = new TgdTexture2D(context)
        this.texture = texture
        texture.loadBitmap(tgdLoadImage(SpaceshipURL))
        const ds = new TgdDataset({
            attPos: "vec2",
            attUV: "vec2",
        })
        const W = 0.2
        const H = 0.1
        // prettier-ignore
        ds.set("attPos", new Float32Array([
            -W, +H,
            +W, +H,
            -W, -H,
            +W, -H
        ]))
        // prettier-ignore
        ds.set("attUV", new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ]))
        const prg = new TgdProgram(context.gl, {
            vert: VERT,
            frag: FRAG,
        })
        this.prg = prg
        const vao = new TgdVertexArray(context.gl, prg, [ds])
        this.vao = vao
    }

    delete(): void {
        this.texture.delete()
        this.prg.delete()
        this.vao.delete()
    }

    paint(time: number, delay: number): void {
        const { context, texture, prg, vao, scaleX, scaleY } = this
        const { gl } = context
        prg.use()
        prg.uniform2f("uniScale", scaleX, scaleY)
        texture.activate(0, prg, "uniTexture")
        vao.bind()
        TgdPainterState.do({ gl, blend: webglPresetBlend.alpha }, () =>
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        )
        vao.unbind()
    }
}
