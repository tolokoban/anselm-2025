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
const specularExponent = 10
const specularIntensity = 0.2

export class Material extends TgdMaterial {
    public light = 1

    constructor(options: TgdMaterialDiffuseOptions = {}) {
        const color =
            options.color instanceof TgdTexture2D
                ? options.color
                : new TgdVec4(options.color ?? DEFAULT_COLOR)
        const hasTexture = !(color instanceof TgdVec4)
        const texture = hasTexture ? color : null
        const uniLightDir = new TgdVec3(0, 0, -1)
        const fragmentShaderCode = [
            `vec3 uniLightDir = vec3(${uniLightDir.join(", ")});`,
            `float uniSpecularIntensity = ${specularIntensity.toFixed(2)};`,
            `float uniSpecularExponent = ${specularExponent.toFixed(2)};`,
            "vec3 normal = normalize(varNormal);",
            `float light = .5 * (1.0 - dot(normal, uniLightDir));`,
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
        const vertexShaderCode = [
            "varNormal = mat3(uniTransfoMatrix) * NORMAL;",
        ]
        const varyings: { [name: string]: WebglAttributeType } = {
            varNormal: "vec3",
        }
        const uniforms: { [name: string]: WebglUniformType } = {
            uniModelViewMatrix: "mat4",
            uniLight: "float",
        }
        if (hasTexture) {
            vertexShaderCode.push("varUV = TEXCOORD_0;")
            varyings.varUV = "vec2"
            uniforms.texDiffuse = "sampler2D"
        }
        super({
            uniforms,
            varyings,
            vertexShaderCode,
            fragmentShaderCode,
            setUniforms: (program, time, delay) => {
                if (texture) texture.activate(0, program, "texDiffuse")
                program.uniform1f("uniLight", this.light)
            },
        })
    }
}
