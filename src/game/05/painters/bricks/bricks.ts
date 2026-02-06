import {
    type TgdContext,
    TgdPainter,
    TgdPainterSpritesHue,
    TgdPainterState,
    type TgdSpriteHue,
    TgdTexture2D,
    type WebglImage,
    webglPresetBlend,
} from "@tolokoban/tgd"
import { AtlasDefBricks } from "@/gfx/05/bricks"

export interface PainterBricksOptions {
    atlasImage: WebglImage
}

export class PainterBricks extends TgdPainter {
    private readonly painter: TgdPainter
    private readonly spritesPainter: TgdPainterSpritesHue
    private readonly texture: TgdTexture2D

    constructor(context: TgdContext, options: PainterBricksOptions) {
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
        this.spritesPainter = new TgdPainterSpritesHue(context, {
            atlas: [
                AtlasDefBricks.sprites.bricks0,
                AtlasDefBricks.sprites.bricks1,
                AtlasDefBricks.sprites.bricks2,
                AtlasDefBricks.sprites.bricks3,
                AtlasDefBricks.sprites.bricks4,
                AtlasDefBricks.sprites.bricks5,
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

    remove(sprite: TgdSpriteHue) {
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
