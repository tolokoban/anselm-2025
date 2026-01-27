import {
    type TgdContext,
    TgdPainter,
    TgdPainterSprites,
    TgdPainterState,
    type TgdSprite,
    TgdTexture2D,
    tgdCalcClamp,
    tgdCalcMapRange,
    tgdCalcModulo,
    type WebglImage,
    webglPresetBlend,
} from "@tolokoban/tgd"
import { AtlasDefPads } from "@/gfx/05/pads"
import { EnumHitResult, type HitResult } from "../../types"

export interface PainterPadOptions {
    atlasImage: WebglImage
}

export class PainterPad extends TgdPainter {
    private readonly painter: TgdPainter
    private readonly spritesPainter: TgdPainterSprites
    private readonly texture: TgdTexture2D
    private readonly sprite: TgdSprite

    constructor(
        private readonly context: TgdContext,
        options: PainterPadOptions
    ) {
        super()
        const texture = new TgdTexture2D(context, {
            load: options.atlasImage,
            params: {
                wrapR: "CLAMP_TO_EDGE",
                wrapS: "CLAMP_TO_EDGE",
                wrapT: "CLAMP_TO_EDGE",
            },
        })
        this.texture = texture
        this.spritesPainter = new TgdPainterSprites(context, {
            atlas: [
                AtlasDefPads.sprites.pads0,
                AtlasDefPads.sprites.pads1,
                AtlasDefPads.sprites.pads2,
                AtlasDefPads.sprites.pads3,
                AtlasDefPads.sprites.pads4,
                AtlasDefPads.sprites.pads5,
                AtlasDefPads.sprites.pads6,
                AtlasDefPads.sprites.pads7,
                AtlasDefPads.sprites.pads8,
                AtlasDefPads.sprites.pads9,
                AtlasDefPads.sprites.pads10,
                AtlasDefPads.sprites.pads11,
                AtlasDefPads.sprites.pads12,
                AtlasDefPads.sprites.pads13,
                AtlasDefPads.sprites.pads14,
                AtlasDefPads.sprites.pads15,
            ],
            texture,
            atlasUnit: 4,
        })
        const sprite = this.spritesPainter.spriteCreate({
            y: -12,
        })
        this.sprite = sprite
        this.painter = new TgdPainterState(context, {
            blend: webglPresetBlend.alpha,
            children: [this.spritesPainter],
        })
    }

    get x() {
        return this.sprite.x
    }
    set x(value: number) {
        this.sprite.x = tgdCalcClamp(value, -11, 11)
    }

    get y() {
        return this.sprite.y
    }
    set y(value: number) {
        this.sprite.y = tgdCalcClamp(value, -12, 12)
    }

    hit(x: number, y: number, dx: number, dy: number): HitResult | null {
        if (dy > 0 || Math.abs(y - this.y) > 0.5) return null

        const dist = x - this.x
        if (Math.abs(dist) > 2) return null

        const h = 2 - 1 / 8
        const ang = 30
        const abs = Math.abs(dist)
        const normalAngleDeg =
            (abs < h
                ? tgdCalcMapRange(abs, 0, h, 0, ang)
                : tgdCalcMapRange(abs, h, 2, ang, -90)) * (dist < 0 ? 1 : -1)
        return {
            type: EnumHitResult.Wall,
            normalAngleDeg,
            x,
            y,
        }
    }

    delete() {
        this.texture.delete()
        this.spritesPainter.delete()
    }

    paint(time: number, delay: number) {
        this.painter.paint(time, delay)
        this.update(time, delay)
    }

    update(time: number, delay: number) {
        const alpha = tgdCalcModulo(time, 0, 0.5)
        this.sprite.index = Math.floor(tgdCalcMapRange(alpha, 0, 0.5, 0, 16))
    }
}
