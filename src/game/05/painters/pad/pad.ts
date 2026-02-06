import {
    type TgdContext,
    TgdPainter,
    TgdPainterSprites,
    TgdPainterState,
    type TgdSprite,
    TgdTexture2D,
    tgdCalcModuloDiscrete,
    type WebglImage,
    webglPresetBlend,
} from "@tolokoban/tgd"

import { AtlasDefPads } from "@/gfx/05/pads"

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
        const sprite = this.spritesPainter.add({
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
        this.sprite.x = value
    }

    get y() {
        return this.sprite.y
    }
    set y(value: number) {
        this.sprite.y = value
    }

    get scale() {
        return this.sprite.scaleX
    }
    set scale(value: number) {
        this.sprite.scaleX = value
    }

    delete() {
        this.texture.delete()
        this.spritesPainter.delete()
    }

    paint(time: number, delay: number) {
        this.sprite.index = tgdCalcModuloDiscrete(time, 0.5, 16)
        this.painter.paint(time, delay)
    }
}
