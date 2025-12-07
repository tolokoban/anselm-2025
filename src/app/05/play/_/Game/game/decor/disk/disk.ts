import {
    TgdContext,
    TgdDataGlb,
    TgdDataset,
    TgdPainter,
    TgdProgram,
    TgdShaderFragment,
    TgdShaderVertex,
    TgdTexture2D,
    TgdVertexArray,
    webglElementTypeFromTypedArray,
} from "@tolokoban/tgd"
import { assert } from "console"

export class PainterDisk extends TgdPainter {
    private readonly vao: TgdVertexArray
    private readonly prg: TgdProgram
    private readonly texColor: TgdTexture2D
    private readonly count: number
    private readonly type: number

    constructor(
        private readonly context: TgdContext,
        glb: TgdDataGlb
    ) {
        super()
        const texColor = new TgdTexture2D(context).loadBitmap(
            glb.getImageAsHTMLElement("Disk")
        )
        const vert = new TgdShaderVertex({
            uniforms: {
                uniModelViewMatrix: "mat4",
                uniProjectionMatrix: "mat4",
            },
            attributes: {
                POSITION: "vec4",
                NORMAL: "vec3",
                TEXCOORD_0: "vec2",
            },
            varying: {
                varUV: "vec2",
                varNormal: "vec3",
            },
            functions: {},
            mainCode: [
                `vec4 position = POSITION;`,
                `varUV = TEXCOORD_0;`,
                `gl_Position = uniProjectionMatrix * uniModelViewMatrix * position;`,
            ],
        }).code
        const frag = new TgdShaderFragment({
            uniforms: {
                texColor: "sampler2D",
            },
            outputs: { FragColor: "vec4" },
            varying: { varUV: "vec2" },
            functions: {},
            mainCode: [
                `FragColor = texture(texColor, varUV);`,
                "FragColor.w = 1.0;",
            ],
        }).code
        const prg = new TgdProgram(context.gl, {
            vert,
            frag,
        })
        const dataset = new TgdDataset({
            POSITION: "vec3",
            NORMAL: "vec3",
            TEXCOORD_0: "vec2",
        })
        glb.setAttrib(dataset, "POSITION", "Disk1")
        glb.setAttrib(dataset, "NORMAL", "Disk1")
        glb.setAttrib(dataset, "TEXCOORD_0", "Disk1")
        const elements = glb.getMeshPrimitiveIndices("Disk1")
        const vao = new TgdVertexArray(context.gl, prg, [dataset], elements)

        this.prg = prg
        this.vao = vao
        this.texColor = texColor
        this.count = elements.length
        this.type = webglElementTypeFromTypedArray(elements)

        dataset.debug()
        prg.debug()
    }

    delete(): void {
        this.vao.delete()
        this.prg.delete()
        this.texColor.delete()
    }

    paint(time: number, delay: number): void {
        const { context, prg, vao, texColor, count, type } = this
        const { gl, camera } = context
        prg.use()
        prg.uniformMatrix4fv("uniModelViewMatrix", camera.matrixModelView)
        prg.uniformMatrix4fv("uniProjectionMatrix", camera.matrixProjection)
        texColor.activate(0, prg, "texColor")
        vao.bind()
        gl.drawElements(gl.TRIANGLES, count, type, 0)
    }
}
