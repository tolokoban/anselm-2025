import {
    tgdCalcDegToRad,
    tgdCalcRandom,
    tgdCodeFunction_mapRange,
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

export type PainterBarPosition = [
    angle1: number,
    distance1: number,
    radius1: number,
    angle2: number,
    distance2: number,
    radius2: number,
]

export class PainterBar extends TgdPainter {
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
        positions: PainterBarPosition[]
    ) {
        super()
        const texColor = new TgdTexture2D(context).loadBitmap(
            assets.glb.getImageAsHTMLElement(name)
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
                attRadius1: "float",
                attDistance1: "float",
                attAngle1: "float",
                attRadius2: "float",
                attDistance2: "float",
                attAngle2: "float",
            },
            varying: {
                varUV: "vec2",
                varNormal: "vec3",
                varPosition: "vec4",
            },
            functions: {
                ...tgdCodeFunction_mapRange(),
            },
            mainCode: [
                `vec4 position = POSITION;`,
                `float scale = abs(attDistance2 - attDistance1) / 30.0;`,
                "float alpha = mapRange(position.z, 0.0, -30.0, 0.0, 1.0);",
                "float angle = mix(attAngle1, attAngle2, alpha);",
                "float distance = mix(attDistance1, attDistance2, alpha);",
                "float radius = mix(attRadius1, attRadius2, alpha);",
                "position *= vec4(1, 1, scale, 1);",
                "vec2 dir = vec2(0, -1);",
                "position += vec4(dir * radius, uniShift - attDistance1, 0);",
                "float C = cos(angle);",
                "float S = sin(angle);",
                "mat4 transfo = mat4(",
                [
                    "C, S, 0.0, 0.0,",
                    "-S, C, 0.0, 0.0,",
                    "0.0, 0.0, 1.0, 0.0,",
                    "0.0, 0.0, 0.0, 1.0",
                ],
                ");",
                "position = transfo * position;",
                "varPosition = position;",
                `gl_Position = uniProjectionMatrix * uniModelViewMatrix * position;`,
                `varNormal = mat3(transfo) * NORMAL;`,
                `varUV = TEXCOORD_0;`,
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
            varying: {
                varUV: "vec2",
                varNormal: "vec3",
                varPosition: "vec4",
            },
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

function createDatasetInstance(positions: PainterBarPosition[]) {
    const datasetInstance = new TgdDataset(
        {
            attRadius1: "float",
            attDistance1: "float",
            attAngle1: "float",
            attRadius2: "float",
            attDistance2: "float",
            attAngle2: "float",
        },
        {
            divisor: 1,
        }
    )
    const attRadius1: number[] = []
    const attDistance1: number[] = []
    const attAngle1: number[] = []
    const attRadius2: number[] = []
    const attDistance2: number[] = []
    const attAngle2: number[] = []
    for (const [
        angle1,
        distance1,
        radius1,
        angle2,
        distance2,
        radius2,
    ] of positions) {
        attAngle1.push(tgdCalcDegToRad(angle1))
        attDistance1.push(distance1)
        attRadius1.push(radius1 + 10)
        attAngle2.push(tgdCalcDegToRad(angle2))
        attDistance2.push(distance2)
        attRadius2.push(radius2 + 10)
    }
    datasetInstance.set("attAngle1", new Float32Array(attAngle1))
    datasetInstance.set("attDistance1", new Float32Array(attDistance1))
    datasetInstance.set("attRadius1", new Float32Array(attRadius1))
    datasetInstance.set("attAngle2", new Float32Array(attAngle2))
    datasetInstance.set("attDistance2", new Float32Array(attDistance2))
    datasetInstance.set("attRadius2", new Float32Array(attRadius2))
    return { countInstance: attRadius1.length, datasetInstance }
}
