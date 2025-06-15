import { pick } from "@/utils/array"
import {
    TgdContext,
    TgdDataGlb,
    TgdDataset,
    TgdPainter,
    TgdProgram,
    TgdVertexArray,
    webglElementTypeFromTypedArray,
} from "@tolokoban/tgd"

import { vert } from "./vert"
import { frag } from "./frag"

export class Tunnel extends TgdPainter {
    private readonly prg: TgdProgram
    private readonly vao: TgdVertexArray
    private readonly count: number
    private readonly type: number
    public light = 0
    public move = 0

    constructor(
        private readonly context: TgdContext,
        asset: TgdDataGlb
    ) {
        super()
        const prg = new TgdProgram(context.gl, { vert, frag })
        this.prg = prg
        const instance = new TgdDataset(
            {
                attShift: "float",
            },
            { divisor: 1 }
        )
        instance.set("attShift", new Float32Array([0, 1, 2, 3, 4]))
        const dataset = new TgdDataset({
            POSITION: "vec3",
            NORMAL: "vec3",
            TEXCOORD_0: "vec2",
        })
        asset.setAttrib(dataset, "POSITION")
        asset.setAttrib(dataset, "NORMAL")
        asset.setAttrib(dataset, "TEXCOORD_0")
        const elements = asset.getMeshPrimitiveIndices()
        this.type = webglElementTypeFromTypedArray(elements)
        this.count = elements.length
        const vao = new TgdVertexArray(
            context.gl,
            prg,
            [instance, dataset],
            elements
        )
        this.vao = vao
    }

    delete(): void {
        this.prg.delete()
        this.vao.delete()
    }

    paint(time: number, delay: number): void {
        const { context, prg, vao, count, type, move } = this
        const { gl } = context
        prg.use()
        prg.uniformMatrix4fv(
            "uniModelViewMatrix",
            context.camera.matrixModelView
        )
        prg.uniformMatrix4fv(
            "uniProjectionMatrix",
            context.camera.matrixProjection
        )
        prg.uniform1f("uniMove", move) // time * 100
        prg.uniform1f("uniLight", this.light)
        prg.uniform1f("uniHue", time)
        vao.bind()
        gl.drawElementsInstanced(gl.TRIANGLES, count, type, 0, 4)
        vao.unbind()
    }
}
