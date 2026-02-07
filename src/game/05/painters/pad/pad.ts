import {
    type TgdContext,
    TgdPainter,
    TgdPainterGroup,
    TgdPainterSprites,
    TgdPainterState,
    type TgdSprite,
    TgdTexture2D,
    tgdCalcModuloDiscrete,
    type WebglImage,
    webglPresetBlend,
    webglPresetDepth,
} from "@tolokoban/tgd"

import { AtlasDefPads } from "@/gfx/05/pads"
import { AtlasDefPadsbloom } from "@/gfx/05/padsbloom"

export interface PainterPadOptions {
    atlasImage: WebglImage
    atlasImageBloom: WebglImage
}

export class PainterPad extends TgdPainter {
    private readonly painter: TgdPainter
    private readonly padPainter: TgdPainterSprites
    private readonly bloomPainter: TgdPainterSprites
    private readonly texturePad: TgdTexture2D
    private readonly textureBloom: TgdTexture2D
    private readonly pad: TgdSprite
    private readonly bloom: TgdSprite

    constructor(
        private readonly context: TgdContext,
        options: PainterPadOptions
    ) {
        super()
        const texturePad = new TgdTexture2D(context, {
            load: options.atlasImage,
            params: {
                wrapR: "CLAMP_TO_EDGE",
                wrapS: "CLAMP_TO_EDGE",
                wrapT: "CLAMP_TO_EDGE",
            },
        })
        this.texturePad = texturePad
        this.padPainter = new TgdPainterSprites(context, {
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
            texture: texturePad,
            atlasUnit: 4,
        })
        const sprite = this.padPainter.add({
            y: -12,
        })
        this.pad = sprite
        const textureBloom = new TgdTexture2D(context, {
            load: options.atlasImageBloom,
            params: {
                wrapR: "CLAMP_TO_EDGE",
                wrapS: "CLAMP_TO_EDGE",
                wrapT: "CLAMP_TO_EDGE",
            },
        })
        this.textureBloom = textureBloom
        this.bloomPainter = new TgdPainterSprites(context, {
            atlas: [
                AtlasDefPadsbloom.sprites.padsbloom0,
                AtlasDefPadsbloom.sprites.padsbloom1,
                AtlasDefPadsbloom.sprites.padsbloom2,
                AtlasDefPadsbloom.sprites.padsbloom3,
                AtlasDefPadsbloom.sprites.padsbloom4,
                AtlasDefPadsbloom.sprites.padsbloom5,
                AtlasDefPadsbloom.sprites.padsbloom6,
                AtlasDefPadsbloom.sprites.padsbloom7,
                AtlasDefPadsbloom.sprites.padsbloom8,
                AtlasDefPadsbloom.sprites.padsbloom9,
                AtlasDefPadsbloom.sprites.padsbloom10,
                AtlasDefPadsbloom.sprites.padsbloom11,
                AtlasDefPadsbloom.sprites.padsbloom12,
                AtlasDefPadsbloom.sprites.padsbloom13,
                AtlasDefPadsbloom.sprites.padsbloom14,
                AtlasDefPadsbloom.sprites.padsbloom15,
            ],
            texture: textureBloom,
            atlasUnit: 4,
        })
        const bloom = this.bloomPainter.add({
            y: -12,
        })
        this.bloom = bloom
        this.painter = new TgdPainterGroup([
            new TgdPainterState(context, {
                blend: webglPresetBlend.alpha,
                children: [this.padPainter],
            }),
            new TgdPainterState(context, {
                depth: webglPresetDepth.off,
                blend: webglPresetBlend.add,
                children: [this.bloomPainter],
            }),
        ])
    }

    get x() {
        return this.pad.x
    }
    set x(value: number) {
        this.pad.x = value
    }

    get y() {
        return this.pad.y
    }
    set y(value: number) {
        this.pad.y = value
    }

    get scale() {
        return this.pad.scaleX
    }
    set scale(value: number) {
        this.pad.scaleX = value
    }

    delete() {
        this.texturePad.delete()
        this.padPainter.delete()
    }

    paint(time: number, delay: number) {
        this.pad.index = tgdCalcModuloDiscrete(time, 0.5, 16)
        this.bloom.index = this.pad.index
        this.bloom.x = this.pad.x
        this.painter.paint(time, delay)
    }
}
