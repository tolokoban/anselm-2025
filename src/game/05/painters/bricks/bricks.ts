import {
    type TgdContext,
    TgdPainter,
    TgdPainterSprites,
    TgdPainterSpritesHue,
    TgdPainterState,
    type TgdSprite,
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
    private readonly shadowsPainter: TgdPainterSprites
    private readonly texture: TgdTexture2D
    private readonly links = new Map<TgdSpriteHue, TgdSprite>()

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
        this.shadowsPainter = new TgdPainterSprites(context, {
            atlas: [AtlasDefBricks.sprites.bricks6],
            texture,
            atlasUnit: 2,
        })
        this.painter = new TgdPainterState(context, {
            blend: webglPresetBlend.alpha,
            children: [this.shadowsPainter, this.spritesPainter],
        })
    }

    clear() {
        this.spritesPainter.clear()
        this.shadowsPainter.clear()
        this.links.clear()
    }

    readonly add = (x: number, y: number) => {
        const sprite = this.spritesPainter.add({ x, y })
        const shadow = this.shadowsPainter.add({
            x: x + 0.25,
            y: y - 0.5,
            z: -0.5e-1,
        })
        this.links.set(sprite, shadow)
        return sprite
    }

    remove(sprite: TgdSpriteHue) {
        this.spritesPainter.remove(sprite)
        const shadow = this.links.get(sprite)
        if (shadow) {
            this.shadowsPainter.remove(shadow)
            this.links.delete(sprite)
        }
    }

    delete() {
        this.texture.delete()
        this.spritesPainter.delete()
    }

    paint(time: number, delay: number) {
        this.painter.paint(time, delay)
    }
}
