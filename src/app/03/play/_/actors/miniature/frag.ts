import { tgdCodeFunction_shiftHue, TgdShaderFragment } from "@tolokoban/tgd"

export const frag = new TgdShaderFragment({
    uniforms: {
        uniPercent: "float",
        uniTextureBack: "sampler2D",
        uniTextureFront: "sampler2D",
    },
    varying: {
        varUV: "vec2",
    },
    mainCode: [
        `vec4 front = texture(uniTextureFront, varUV);`,
        `vec4 back1 = texture(uniTextureBack, varUV);`,
        `vec4 back0 = vec4(`,
        ["vec3((back1.r + back1.g + back1.b) / 16.0),", "back1.a"],
        ");",
        "vec4 back = mix(",
        [
            "back1,",
            "back0,",
            "smoothstep(uniPercent, uniPercent + .1, varUV.y)",
        ],
        ");",
        "FragColor = mix(back, front, front.a);",
    ],
    outputs: {
        FragColor: "vec4",
    },
}).code
