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
import { AtlasDefLaser } from "@/gfx/05/laser"

export interface PainterLaserOptions {
    atlasImage: WebglImage
}

interface SpriteLaser extends TgdSprite {
    timeShift: number
    dx: number
    dy: number
}

export class PainterLaser extends TgdPainter {
    private readonly painter: TgdPainter
    private readonly spritesPainter: TgdPainterSprites<SpriteLaser>
    private readonly texture: TgdTexture2D

    constructor(context: TgdContext, options: PainterLaserOptions) {
        super()
        const texture = new TgdTexture2D(context, {
            load: options.atlasImage,
        })
        this.texture = texture
        this.spritesPainter = new TgdPainterSprites<SpriteLaser>(context, {
            atlas: [
                AtlasDefLaser.sprites.laser0,
                AtlasDefLaser.sprites.laser1,
                AtlasDefLaser.sprites.laser2,
                AtlasDefLaser.sprites.laser3,
                AtlasDefLaser.sprites.laser4,
                AtlasDefLaser.sprites.laser5,
                AtlasDefLaser.sprites.laser6,
                AtlasDefLaser.sprites.laser7,
                AtlasDefLaser.sprites.laser8,
                AtlasDefLaser.sprites.laser9,
                AtlasDefLaser.sprites.laser10,
                AtlasDefLaser.sprites.laser11,
                AtlasDefLaser.sprites.laser12,
                AtlasDefLaser.sprites.laser13,
                AtlasDefLaser.sprites.laser14,
                AtlasDefLaser.sprites.laser15,
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

    add(x: number, y: number) {
        return this.spritesPainter.add({
            x,
            y,
            dx: 0,
            dy: 1,
            timeShift: Math.random(),
        })
    }

    remove(sprite: TgdSprite) {
        this.spritesPainter.remove(sprite)
    }

    forEach(callback: (sprite: SpriteLaser) => void) {
        this.spritesPainter.forEach(callback)
    }

    delete() {
        this.texture.delete()
        this.spritesPainter.delete()
    }

    paint(time: number, delay: number) {
        this.painter.paint(time, delay)
        this.spritesPainter.forEach((sprite) => {
            sprite.index = tgdCalcModuloDiscrete(
                time + sprite.timeShift,
                0.25,
                16
            )
        })
    }
}
