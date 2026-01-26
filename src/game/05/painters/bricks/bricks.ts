import {
    type TgdContext,
    TgdPainter,
    TgdPainterSprites,
    TgdPainterState,
    TgdTexture2D,
    type WebglImage,
    webglPresetBlend,
} from "@tolokoban/tgd"
import { text } from "stream/consumers"
import { AtlasDefBricks } from "@/gfx/05/bricks"
import type { ArkanoidLevel } from "../../levels/types"
import { EnumBrick, EnumHitResult, type HitResult } from "../../types"
import type { Brick } from "./brick"
import { parseLevel } from "./parse-level"

export interface PainterBricksOptions {
    atlasImage: WebglImage
    level: ArkanoidLevel
}

export class PainterBricks extends TgdPainter {
    private readonly painter: TgdPainter
    private readonly spritesPainter: TgdPainterSprites
    private readonly texture: TgdTexture2D
    private readonly bricks: Brick[][]
    private time = 0

    constructor(
        private readonly context: TgdContext,
        options: PainterBricksOptions
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
        this.bricks = parseLevel(this.spritesPainter, options.level)
    }

    readonly hit = (args: {
        x: number
        y: number
        dx: number
        dy: number
    }): HitResult | null => {
        const { x, y, dx, dy } = args
        const row = Math.floor(12.5 - y)
        const bricks = this.bricks[row]
        if (!bricks) return null

        for (const brick of bricks) {
            if (brick.dead) continue

            if (Math.abs(brick.x - x) < 1) {
                brick.punch(this.time)
                return {
                    type:
                        brick.type === EnumBrick.Unbreakable
                            ? EnumHitResult.Wall
                            : EnumHitResult.Brick,
                    normalAngleDeg: computeAngle(brick, args),
                }
            }
        }
        return null
    }

    delete() {
        this.texture.delete()
        this.spritesPainter.delete()
    }

    paint(time: number, delay: number) {
        this.time = time
        this.painter.paint(time, delay)
    }
}

function computeAngle(
    brick: Brick,
    args: { x: number; y: number; dx: number; dy: number }
): number {
    const { x, y, dx, dy } = args
    const x0 = x - brick.x
    const y0 = y - brick.y
    const xx = x0 - (Math.abs(0.5 - y0) * dx) / dy
    const angle = Math.abs(xx) > 1 ? (dx > 0 ? 90 : -90) : dy > 0 ? 180 : 0
    return angle
}
