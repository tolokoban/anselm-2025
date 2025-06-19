import { TgdShaderVertex } from "@tolokoban/tgd"

export const vert = new TgdShaderVertex({
    attributes: {
        attUV: "vec2",
    },
    varying: {
        varUV: "vec2",
    },
    mainCode: [
        "varUV = attUV;",
        "vec2 pos = varUV * vec2(.1, 2.0);",
        "float x = pos.x;",
        "float y = pos.y;",
        "gl_Position = vec4(",
        ["x - 1.0,", "1.0 - y,", "0.0,", "1.0"],
        ");",
    ],
}).code
