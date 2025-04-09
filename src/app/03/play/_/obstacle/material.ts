import {
    ArrayNumber4,
    TgdCodeBloc,
    TgdLight,
    TgdMaterial,
    TgdProgram,
    TgdTexture2D,
    TgdVec3,
    TgdVec4,
    WebglAttributeType,
    WebglUniformType,
} from "@tolokoban/tgd"

export type TgdMaterialDiffuseOptions = Partial<{
    color: TgdVec4 | ArrayNumber4 | TgdTexture2D
}>

const DEFAULT_COLOR = new TgdVec4(0.8, 0.6, 0.1, 1)

export class Material extends TgdMaterial {
    public light = 1
    public readonly varyings: { [name: string]: WebglAttributeType }
    public readonly uniforms: { [name: string]: WebglUniformType } = {
        uniModelViewMatrix: "mat4",
        uniLight: "float",
    }
    public readonly vertexShaderCode: TgdCodeBloc

    public readonly fragmentShaderCode: TgdCodeBloc

    private readonly texture: TgdTexture2D | null
    private specularExponent = 10
    private specularIntensity = 0.2

    constructor(options: TgdMaterialDiffuseOptions = {}) {
        super()
        const color =
            options.color instanceof TgdTexture2D
                ? options.color
                : new TgdVec4(options.color ?? DEFAULT_COLOR)
        const hasTexture = !(color instanceof TgdVec4)
        this.texture = hasTexture ? color : null
        const uniLightDir = new TgdVec3(0, 0, -1)
        this.fragmentShaderCode = [
            `vec3 uniLightDir = vec3(${uniLightDir.join(", ")});`,
            `float uniSpecularIntensity = ${this.specularIntensity.toFixed(2)};`,
            `float uniSpecularExponent = ${this.specularExponent.toFixed(2)};`,
            "vec3 normal = normalize(varNormal);",
            `float light = 1.0 - dot(normal, uniLightDir);`,
            hasTexture
                ? `vec4 color = texture(texDiffuse, varUV);`
                : `vec4 color = vec4(${color.join(", ")});`,
            `vec3 normal2 = mat3(uniModelViewMatrix) * normal;`,
            `float spec = max(0.0, reflect(uniLightDir, normal2).z);`,
            `spec = pow(spec, uniSpecularExponent) * uniSpecularIntensity;`,
            `color = vec4(`,
            `  color.rgb * vec3(light) + vec3(spec),`,
            `  1.0`,
            `);`,
            `float ghost = smoothstep(0.5, 0.0, normal.z) * .3;`,
            `color.rgb += vec3(1.0 + normal.x, 1.0 + normal.y, 0.0) * ghost;`,
            `return color * vec4(vec3(uniLight), 1.0);`,
        ]
        this.vertexShaderCode = ["varNormal = mat3(uniTransfoMatrix) * NORMAL;"]
        this.varyings = {
            varNormal: "vec3",
        }
        if (hasTexture) {
            this.vertexShaderCode.push("varUV = TEXCOORD_0;")
            this.varyings.varUV = "vec2"
            this.uniforms.texDiffuse = "sampler2D"
        }
    }

    setUniforms(program: TgdProgram): void {
        const { texture, light } = this
        if (texture) texture.activate(0, program, "texDiffuse")
        program.uniform1f("uniLight", light)
    }
}
