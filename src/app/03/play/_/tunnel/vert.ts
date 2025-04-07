import { TgdShaderVertex } from "@tolokoban/tgd"

export const vert = new TgdShaderVertex({
    uniforms: {
        uniModelViewMatrix: "mat4",
        uniProjectionMatrix: "mat4",
        uniMove: "float",
        uniLight: "float",
    },
    attributes: {
        attShift: "float",
        POSITION: "vec3",
        NORMAL: "vec3",
        TEXCOORD_0: "vec2",
    },
    varying: {
        varNormal: "vec3",
        varLight: "float",
    },
    mainCode: [
        `float SIZE = 100.0;`,
        `varNormal = mat3(uniModelViewMatrix) * NORMAL;`,
        `vec4 point = vec4(POSITION, 1.0);`,
        `point.z -= SIZE * attShift;`,
        `point.z += mod(uniMove, SIZE);`,
        `varLight = smoothstep(-200.0, 0.0, point.z) * uniLight;`,
        `gl_Position = uniProjectionMatrix * uniModelViewMatrix * point;`,
    ],
}).code
