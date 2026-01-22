import {
    tgdCalcDegToRad,
    tgdCalcRandom,
    TgdContext,
    TgdDataGlb,
    TgdDataset,
    TgdPainter,
    TgdProgram,
    TgdShaderFragment,
    TgdShaderVertex,
    TgdTexture2D,
    TgdTextureCube,
    TgdVertexArray,
    webglElementTypeFromTypedArray,
} from "@tolokoban/tgd"

export type PainterDiskPosition = [
    angle: number,
    distance: number,
    radius?: number,
]
export class PainterDisk extends TgdPainter {
    public shift = 0

    private readonly vao: TgdVertexArray
    private readonly prg: TgdProgram
    private readonly texColor: TgdTexture2D
    private readonly texAmbient: TgdTextureCube
    private readonly countInstance: number
    private readonly count: number
    private readonly type: number

    constructor(
        private readonly context: TgdContext,
        assets: {
            glb: TgdDataGlb
            skybox: {
                imagePosX: HTMLImageElement
                imagePosY: HTMLImageElement
                imagePosZ: HTMLImageElement
                imageNegX: HTMLImageElement
                imageNegY: HTMLImageElement
                imageNegZ: HTMLImageElement
            }
        },
        name: string,
        positions: PainterDiskPosition[]
    ) {
        super()
        const texColor = new TgdTexture2D(context).loadBitmap(
            assets.glb.getImageAsHTMLElement("Disk")
        )
        const texAmbient = new TgdTextureCube(context, assets.skybox)
        const vert = new TgdShaderVertex({
            uniforms: {
                uniModelViewMatrix: "mat4",
                uniProjectionMatrix: "mat4",
                uniShift: "float",
            },
            attributes: {
                POSITION: "vec4",
                NORMAL: "vec3",
                TEXCOORD_0: "vec2",
                attRadius: "float",
                attDistance: "float",
                attCos: "float",
                attSin: "float",
            },
            varying: {
                varUV: "vec2",
                varNormal: "vec3",
                varPosition: "vec4",
            },
            functions: {},
            mainCode: [
                `vec4 position = POSITION;`,
                "vec2 dir = vec2(0, -1);",
                "position += vec4(dir * attRadius, uniShift - attDistance, 0);",
                "mat4 transfo = mat4(",
                [
                    "attCos, attSin, 0.0, 0.0,",
                    "-attSin, attCos, 0.0, 0.0,",
                    "0.0, 0.0, 1.0, 0.0,",
                    "0.0, 0.0, 0.0, 1.0",
                ],
                ");",
                `varNormal = mat3(transfo) * NORMAL;`,
                "position = transfo * position;",
                "varPosition = position;",
                `varUV = TEXCOORD_0;`,
                `gl_Position = uniProjectionMatrix * uniModelViewMatrix * position;`,
            ],
        }).code
        const frag = new TgdShaderFragment({
            uniforms: {
                texColor: "sampler2D",
                texAmbient: "samplerCube",
                uniCameraPosition: "vec3",
                uniSpecularExponent: "float",
                uniSpecularIntensity: "float",
            },
            outputs: { FragColor: "vec4" },
            varying: { varUV: "vec2", varNormal: "vec3", varPosition: "vec4" },
            functions: {},
            mainCode: [
                `vec3 N = normalize(varNormal);`,
                `vec3 L = normalize(varPosition.xyz - uniCameraPosition);`,
                `vec3 R = reflect(L, N);`,
                `vec3 color = texture(texAmbient, R).rgb;`,
                `color = pow(color, vec3(uniSpecularExponent));`,
                `color *= uniSpecularIntensity;`,
                `FragColor = vec4(color, 1) * texture(texColor, varUV);`,
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
        assets.glb.setAttrib(dataset, "POSITION", name)
        assets.glb.setAttrib(dataset, "NORMAL", name)
        assets.glb.setAttrib(dataset, "TEXCOORD_0", name)
        const { countInstance, datasetInstance } =
            createDatasetInstance(positions)
        this.countInstance = countInstance
        const elements = assets.glb.getMeshPrimitiveIndices(name)
        const vao = new TgdVertexArray(
            context.gl,
            prg,
            [dataset, datasetInstance],
            elements
        )

        this.prg = prg
        this.vao = vao
        this.texColor = texColor
        this.texAmbient = texAmbient
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
        const {
            context,
            prg,
            vao,
            texColor,
            texAmbient,
            countInstance,
            count,
            type,
            shift,
        } = this
        const { gl, camera } = context
        prg.use()
        prg.uniformMatrix4fv("uniModelViewMatrix", camera.matrixModelView)
        prg.uniformMatrix4fv("uniProjectionMatrix", camera.matrixProjection)
        prg.uniform3fv("uniCameraPosition", context.camera.transfo.position)
        prg.uniform1f("uniShift", shift)
        prg.uniform1f("uniSpecularExponent", 6.2)
        prg.uniform1f("uniSpecularIntensity", 3)
        texColor.activate(0, prg, "texColor")
        texAmbient.activate(1, prg, "texAmbient")
        vao.bind()
        gl.drawElementsInstanced(gl.TRIANGLES, count, type, 0, countInstance)
    }
}

function createDatasetInstance(positions: PainterDiskPosition[]) {
    const datasetInstance = new TgdDataset(
        {
            attRadius: "float",
            attDistance: "float",
            attCos: "float",
            attSin: "float",
        },
        {
            divisor: 1,
        }
    )
    const attRadius: number[] = []
    const attDistance: number[] = []
    const attCos: number[] = []
    const attSin: number[] = []
    for (const [angle, distance, radius] of positions) {
        for (let loop = 0; loop < 120; loop += 120) {
            const radians = tgdCalcDegToRad(loop + angle)
            attRadius.push(10 + (radius ?? 0))
            attDistance.push(distance)
            attCos.push(Math.cos(radians))
            attSin.push(Math.sin(radians))
        }
    }
    datasetInstance.set("attRadius", new Float32Array(attRadius))
    datasetInstance.set("attDistance", new Float32Array(attDistance))
    datasetInstance.set("attCos", new Float32Array(attCos))
    datasetInstance.set("attSin", new Float32Array(attSin))
    return { countInstance: attRadius.length, datasetInstance }
}
