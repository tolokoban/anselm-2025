import {
    type TgdContext,
    TgdPainter,
    TgdPainterSprites,
    TgdPainterState,
    type TgdSprite,
    TgdTexture2D,
    tgdCanvasCreateWithContext2D,
    type WebglImage,
    webglPresetBlend,
} from "@tolokoban/tgd"
import { AtlasDefBonuses } from "@/gfx/05/bonuses"
import { EnumBonusType } from "./../levels/types"

export interface PainterBonusesOptions {
    atlasImage: WebglImage
}

export class PainterBonuses extends TgdPainter {
    private readonly painter: TgdPainter
    private readonly spritesPainter: TgdPainterSprites
    private readonly texture: TgdTexture2D

    constructor(context: TgdContext, options: PainterBonusesOptions) {
        super()
        const texture = new TgdTexture2D(context, {
            load: addLabels(options.atlasImage),
            params: {
                wrapR: "CLAMP_TO_EDGE",
                wrapS: "CLAMP_TO_EDGE",
                wrapT: "CLAMP_TO_EDGE",
            },
        })
        this.texture = texture
        this.spritesPainter = new TgdPainterSprites(context, {
            atlas: [
                AtlasDefBonuses.sprites.bonuses0,
                AtlasDefBonuses.sprites.bonuses1,
                AtlasDefBonuses.sprites.bonuses2,
                AtlasDefBonuses.sprites.bonuses3,
                AtlasDefBonuses.sprites.bonuses4,
                AtlasDefBonuses.sprites.bonuses5,
                AtlasDefBonuses.sprites.bonuses6,
                AtlasDefBonuses.sprites.bonuses7,
            ],
            texture,
            atlasUnit: 2,
        })
        this.painter = new TgdPainterState(context, {
            blend: webglPresetBlend.alpha,
            children: [this.spritesPainter],
        })
    }

    clear() {
        this.spritesPainter.clear()
    }

    readonly add = () => {
        return this.spritesPainter.add({})
    }

    remove(sprite: TgdSprite) {
        this.spritesPainter.remove(sprite)
    }

    delete() {
        this.texture.delete()
        this.spritesPainter.delete()
    }

    paint(time: number, delay: number) {
        this.painter.paint(time, delay)
    }
}

function addLabels(img: WebglImage) {
    if (!(img instanceof HTMLImageElement)) return

    const defs = [
        AtlasDefBonuses.sprites.bonuses0,
        AtlasDefBonuses.sprites.bonuses1,
        AtlasDefBonuses.sprites.bonuses2,
        AtlasDefBonuses.sprites.bonuses3,
        AtlasDefBonuses.sprites.bonuses4,
        AtlasDefBonuses.sprites.bonuses5,
        AtlasDefBonuses.sprites.bonuses6,
        AtlasDefBonuses.sprites.bonuses7,
    ]
    const w = img.width
    const h = img.height
    const { canvas, ctx } = tgdCanvasCreateWithContext2D(w, h)
    ctx.drawImage(img, 0, 0)
    ctx.strokeStyle = "#0009"
    ctx.fillStyle = "#fffb"
    ctx.font = `bold ${h / 8}px sans-serif`
    ctx.lineWidth = h / 64
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    const cases: Array<[EnumBonusType, string]> = [
        [EnumBonusType.TripleBall, "TRI"],
        [EnumBonusType.StickyPad, "GLU"],
        [EnumBonusType.BurningBall, "FIR"],
        [EnumBonusType.LargePad, "GRW"],
        [EnumBonusType.SmallPad, "SHR"],
        [EnumBonusType.UpsideDown, "UPD"],
        [EnumBonusType.Laser, "LAS"],
        [EnumBonusType.Slow, "\\@_"],
    ]
    for (const [type, text] of cases) {
        const { x, y, width, height } = defs[type % 8]
        const xx = (x + width / 2) * w
        const yy = (y + height / 2) * h
        ctx.strokeText(text, xx, yy)
        ctx.fillText(text, xx, yy)
    }
    return canvas
}
