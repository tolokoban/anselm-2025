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
        const { x, y } = args
        const row = Math.floor(12.5 - y)
        const bricks = this.bricks[row]
        if (!bricks) return null

        for (const brick of bricks) {
            if (brick.dead) continue

            if (Math.abs(brick.x - x) < 1 && Math.abs(brick.y - y) < 0.5) {
                brick.punch(this.time)
                return {
                    type:
                        brick.type === EnumBrick.Unbreakable
                            ? EnumHitResult.Wall
                            : EnumHitResult.Brick,
                    ...computeAngle(brick, args),
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
): {
    x: number
    y: number
    normalAngleDeg: number
} {
    const { x, y, dx, dy } = args
    const x0 = x - brick.x
    const y0 = y - brick.y
    const xx = x - dx
    const yy = y - dy
    if (dy > 0) {
        // Ball is going up.
        const hori = crossHori(x0, y0, dx, dy, 0, -0.5)
        if (Math.abs(hori) <= 1) {
            return {
                normalAngleDeg: 180,
                x,
                y,
            }
        } else {
            return {
                normalAngleDeg: dx > 0 ? 90 : -90,
                x,
                y,
            }
        }
    } else {
        // Ball is going down.
        const hori = crossHori(x0, y0, dx, dy, 0, +0.5)
        if (Math.abs(hori) <= 1) {
            return {
                normalAngleDeg: 0,
                x,
                y,
            }
        } else {
            return {
                normalAngleDeg: dx > 0 ? 90 : -90,
                x,
                y,
            }
        }
    }
}

/**
 * @return The coefficient of the crossing point on line 2.
 *
 * Let's call this value `alpha`, then the crossing point will
 * be:
 *
 * ```ts
 * x = x2 + alpha * vx2
 * y = y2 + alpha * vy2
 * ```
 *
 * This value can be infinite if the lines do not cross.
 */
function cross(
    x1: number,
    y1: number,
    vx1: number,
    vy1: number,
    x2: number,
    y2: number,
    vx2: number,
    vy2: number
) {
    /**
     * x1 + t1.vx1 = x2 + t2.vx2
     * y1 + t1.vy1 = y2 + t2.vy2
     *
     * x1.vy1 + t1.vx1.vy1 = x2.vy1 + t2.vx2.vy1
     * y1.vx1 + t1.vx1.vy1 = y2.vx1 + t2.vx1.vy2
     *
     * x1.vy1 - y1.vx1 = x2.vy1 - y2.vx1 = t2.(vx2.vy1 - vx1.vy2)
     *
     * t2 = (x2*vy1 - y2*vx1 + y1*vx1 - x1*vy1) / det
     */
    const det = vx1 * vy2 - vy1 * vx2
    if (det === 0) return Infinity

    return (x2 * vy1 - y2 * vx1 + y1 * vx1 - x1 * vy1) / det
}

function crossHori(
    x1: number,
    y1: number,
    vx1: number,
    vy1: number,
    x2: number,
    y2: number
) {
    return cross(x1, y1, vx1, vy1, x2, y2, 1, 0)
}

function crossVert(
    x1: number,
    y1: number,
    vx1: number,
    vy1: number,
    x2: number,
    y2: number
) {
    return cross(x1, y1, vx1, vy1, x2, y2, 0, 1)
}
