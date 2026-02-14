import {
    type TgdContext,
    TgdDataset,
    TgdPainter,
    TgdPainterState,
    TgdProgram,
    TgdTexture2D,
    TgdVertexArray,
    tgdCalcClamp,
    webglPresetBlend,
    webglPresetCull,
    webglPresetDepth,
} from "@tolokoban/tgd"
import { pick } from "@/utils/array"
import { frag } from "./frag"
import { vert } from "./vert"

export class Miniature extends TgdPainter {
    private readonly texFront: TgdTexture2D
    private readonly texBack: TgdTexture2D
    private readonly prg: TgdProgram
    private readonly vao: TgdVertexArray
    private _percent = 0

    constructor(
        private readonly context: TgdContext,
        options: {
            imageMiniatureBack: HTMLImageElement
            imageMiniatureFront: HTMLImageElement
        }
    ) {
        super()
        this.texBack = new TgdTexture2D(context).loadBitmap(
            options.imageMiniatureBack
        )
        this.texFront = new TgdTexture2D(context).loadBitmap(
            options.imageMiniatureFront
        )
        this.name = "Miniature"
        const prg = new TgdProgram(context.gl, { vert, frag })
        this.prg = prg
        const dataset = new TgdDataset({
            attUV: "vec2",
        })
        dataset.set("attUV", new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]))
        const vao = new TgdVertexArray(context.gl, prg, [dataset])
        this.vao = vao
    }

    get percent() {
        return this._percent
    }
    set percent(value: number) {
        this._percent = tgdCalcClamp(value, 0, 1)
    }

    delete(): void {
        this.prg.delete()
        this.vao.delete()
        this.texBack.delete()
        this.texFront.delete()
    }

    paint(time: number, delay: number): void {
        const { context, prg, vao, texFront, texBack, percent } = this
        const { gl } = context
        prg.use()
        texBack.activate(0, prg, "uniTextureBack")
        texFront.activate(1, prg, "uniTextureFront")
        prg.uniform1f("uniPercent", percent)
        vao.bind()
        TgdPainterState.do(context, {
            cull: webglPresetCull.off,
            depth: webglPresetDepth.off,
            blend: webglPresetBlend.alpha,
            action: () => gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4),
        })
        vao.unbind()
    }
}
