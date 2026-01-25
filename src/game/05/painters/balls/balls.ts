import { AtlasDefBalls } from "@/gfx/05/balls"
import {
    TgdContext,
    TgdPainter,
    TgdPainterSprites,
    TgdPainterState,
    TgdTexture2D,
    WebglImage,
    tgdCalcRandom,
    webglPresetBlend,
} from "@tolokoban/tgd"
import { HitResult } from "../../types"
import { Ball } from "./ball"

export interface PainterBallsOptions {
    atlasImage: WebglImage
    /**
     * Every ball will call this function to know if it has hit
     * a brick or the pad.
     */
    hit(x: number, y: number, dx: number, dy: number): HitResult | null
}

export class PainterBalls extends TgdPainter {
    private readonly painter: TgdPainter
    private readonly spritesPainter: TgdPainterSprites
    private readonly texture: TgdTexture2D
    private balls: Ball[] = []

    constructor(
        private readonly context: TgdContext,
        options: PainterBallsOptions
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
                AtlasDefBalls.sprites.balls0,
                AtlasDefBalls.sprites.balls1,
                AtlasDefBalls.sprites.balls2,
                AtlasDefBalls.sprites.balls3,
                AtlasDefBalls.sprites.balls4,
                AtlasDefBalls.sprites.balls5,
                AtlasDefBalls.sprites.balls6,
                AtlasDefBalls.sprites.balls7,
                AtlasDefBalls.sprites.balls8,
                AtlasDefBalls.sprites.balls9,
                AtlasDefBalls.sprites.balls10,
                AtlasDefBalls.sprites.balls11,
                AtlasDefBalls.sprites.balls12,
                AtlasDefBalls.sprites.balls13,
                AtlasDefBalls.sprites.balls14,
                AtlasDefBalls.sprites.balls15,
            ],
            texture,
            atlasUnit: 2,
        })
        const BALLS_COUNT = 1
        for (let i = 0; i < BALLS_COUNT; i++) {
            const ball = new Ball(this.spritesPainter, {
                hit: options.hit,
            })
            ball.y = -11
            ball.speed = tgdCalcRandom(8, 20)
            ball.angle = -30 + 15 * (i - (BALLS_COUNT - 1) / 2)
            this.balls.push(ball)
        }
        this.painter = new TgdPainterState(context, {
            blend: webglPresetBlend.alpha,
            children: [this.spritesPainter],
        })
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
        for (const ball of this.balls) {
            ball.update(time, delay)
        }
    }
}
