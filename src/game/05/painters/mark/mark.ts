import {
    type TgdContext,
    TgdPainter,
    TgdPainterSprites,
    TgdPainterState,
    TgdTexture2D,
    webglPresetBlend,
    webglPresetDepth,
} from "@tolokoban/tgd"
import MarkURL from "./mark.webp"

export class PainterMark extends TgdPainter {
    private readonly painter: TgdPainter
    private readonly spritesPainter: TgdPainterSprites
    private readonly texture: TgdTexture2D

    constructor(context: TgdContext) {
        super()
        const texture = new TgdTexture2D(context, {
            load: MarkURL,
        })
        this.texture = texture
        this.spritesPainter = new TgdPainterSprites(context, {
            atlas: [
                {
                    x: 0,
                    y: 0,
                    width: .5,
                    height: .5,
                },
                {
                    x: 0.5,
                    y: 0,
                    width: .5,
                    height: .5,
                },
                {
                    x: 0.5,
                    y: 0.5,
                    width: .5,
                    height: .5,
                },
                {
                    x: 0,
                    y: 0.5,
                    width: .5,
                    height: .5,
                },
            ],
            texture,
            atlasUnit: .3,
        })
        this.painter = new TgdPainterState(context, {
            depth: webglPresetDepth.off,
            blend: webglPresetBlend.alpha,
            children: [this.spritesPainter],
        })
    }

    clear() {
        this.spritesPainter.clear()
    }

    add(x: number, y: number, index: number) {
        return this.spritesPainter.add({
            x,
            y,
            index
        })
    }

    paint(time: number, delay: number) {
        this.painter.paint(time, delay)
    }

    delete() {
        this.texture.delete()
        this.spritesPainter.delete()
    }
}
