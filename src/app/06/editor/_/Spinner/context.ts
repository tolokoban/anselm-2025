import React from "react"
import {
    tgdCanvasCreate,
    tgdCanvasCreateWithContext2D,
    tgdCodeFunction_fbm,
    tgdCodeFunction_palette,
    TgdContext,
    TgdPainterClear,
    TgdPainterFragmentShader,
    TgdShaderFragment,
    TgdTexture2D,
} from "@tolokoban/tgd"

class Context {
    constructor(private readonly text: string) {}

    init(canvas: HTMLCanvasElement | null) {
        if (!canvas) return

        const context = new TgdContext(canvas)
        const canvasWithText = createCanvasWithText(this.text)
        const texture = new TgdTexture2D(context).loadBitmap(canvasWithText)
        context.add(
            new TgdPainterClear(context, { color: [0, 0, 0, 1] }),
            new TgdPainterFragmentShader(context, {
                shader: new TgdShaderFragment({
                    functions: {
                        ...tgdCodeFunction_fbm({ G: 0.5, octaves: 3 }),
                        ...tgdCodeFunction_palette(),
                    },
                    mainCode: [
                        "float x = pow(varUV.x, 1.6);",
                        "float y = varUV.y;",
                        "float y0 = mix(0.05, 0.9, x);",
                        "float h = mix(1.0 / 0.9, 1.0 / 0.1, x);",
                        "y = (varUV.y - y0) * h;",
                        "float t = fbm(vec3(x * .1 + uniTime * 2.0, y * 10.0, uniTime * .0));",
                        "float light = smoothstep(0.0, 0.2, .5 - abs(0.5 - y));",
                        "float text = texture(texMessage, vec2(x + uniTime * .1, y)).a;",
                        "if (y < 0.0 || y > 1.0) text = 0.0;",
                        "light *= text;",
                        "FragColor = palette(t) * vec4(vec3(light), 1.0);",
                    ],
                    uniforms: { texMessage: "sampler2D" },
                }),
                setUniforms({ program }) {
                    texture.activate(0, program, "texMessage")
                },
            })
        )
        context.play()
        return () => {
            texture.delete()
            context.delete()
        }
    }
}

export function useContext(text: string) {
    const ref = React.useRef<Context | null>(null)
    if (!ref.current) ref.current = new Context(text)
    return ref.current
}

function createCanvasWithText(text: string) {
    const fontSize = 32
    const font = `${fontSize}px Audiowide, sans-serif`
    const { ctx: ctxMeasure } = tgdCanvasCreateWithContext2D(1, 1)
    ctxMeasure.font = font
    const measure = ctxMeasure.measureText(text)
    // Now we know what size the canvas must be
    const margin = fontSize
    const { ctx, canvas } = tgdCanvasCreateWithContext2D(
        measure.width + 2 * margin,
        fontSize
    )
    ctx.font = font
    ctx.fillText(text, margin, measure.actualBoundingBoxAscent)
    return canvas
}
