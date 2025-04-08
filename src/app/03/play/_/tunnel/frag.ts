import { tgdCodeFunction_shiftHue, TgdShaderFragment } from "@tolokoban/tgd"

export const frag = new TgdShaderFragment({
    uniforms: {
        uniHue: "float",
    },
    varying: {
        varNormal: "vec3",
        varLight: "float",
    },
    functions: {
        ...tgdCodeFunction_shiftHue(),
    },
    outputs: {
        FragColor: "vec4",
    },
    mainCode: [
        `vec3 normal = normalize(varNormal);`,
        `vec3 color = shiftHue(vec3(0.5) + 0.5 * normal, uniHue);`,
        `color *= smoothstep(-1.0, 1.0, normal.z);`,
        `FragColor = vec4(color * varLight, 1.0);`,
    ],
}).code
