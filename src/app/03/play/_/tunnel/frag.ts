import { TgdShaderFragment } from "@tolokoban/tgd"

export const frag = new TgdShaderFragment({
    varying: {
        varNormal: "vec3",
        varLight: "float",
    },
    outputs: {
        FragColor: "vec4",
    },
    mainCode: [
        `vec3 normal = normalize(varNormal);`,
        `vec3 color = vec3(0.5) + 0.5 * normal;`,
        `color *= smoothstep(-1.0, 1.0, normal.z);`,
        `FragColor = vec4(color * varLight, 1.0);`,
    ],
}).code
