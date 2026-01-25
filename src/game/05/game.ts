import { ArkanoidLevels } from "@/game/05/levels"
import { PainterBalls } from "@/game/05/painters/balls"
import { PainterBricks } from "@/game/05/painters/bricks"
import { EnumHitResult, HitResult } from "@/game/05/types"
import {
    TgdContext,
    TgdControllerCameraOrbit,
    TgdGeometryPlane,
    TgdMaterialFlat,
    TgdPainterClear,
    TgdPainterLogic,
    TgdPainterMesh,
    TgdPainterState,
    WebglImage,
    webglPresetDepth,
} from "@tolokoban/tgd"
import React from "react"
import { Inputs } from "./inputs"
import { PainterPad } from "./painters/pad"

class Game {
    readonly init = (
        canvas: HTMLCanvasElement | null,
        assets: {
            atlasBalls: WebglImage
            atlasBricks: WebglImage
            atlasPads: WebglImage
        }
    ) => {
        if (!canvas) return

        const context = new TgdContext(canvas, {
            alpha: true,
        })
        const inputs = new Inputs(context)
        const { camera } = context
        camera.near = 0.01
        camera.far = 1000
        camera.fitSpaceAtTarget(28, 28)
        const bricksPainter = new PainterBricks(context, {
            atlasImage: assets.atlasBricks,
            level: ArkanoidLevels[0],
        })
        const padPainter = new PainterPad(context, {
            atlasImage: assets.atlasPads,
        })
        const hit = (
            x: number,
            y: number,
            dx: number,
            dy: number
        ): HitResult | null => {
            const brickHit = bricksPainter.hit(x, y, dx, dy)
            if (brickHit) return brickHit
            // Walls
            if (x > 13 && dx > 0)
                return {
                    type: EnumHitResult.Wall,
                    normalAngleDeg: -90,
                }
            if (x < -13 && dx < 0)
                return {
                    type: EnumHitResult.Wall,
                    normalAngleDeg: 90,
                }
            if (y > 13 && dy > 0)
                return {
                    type: EnumHitResult.Wall,
                    normalAngleDeg: 180,
                }
            if (y < -15 && dy < 0)
                return {
                    type: EnumHitResult.Wall,
                    normalAngleDeg: 0,
                }
            // Pad
            const padHit = padPainter.hit(x, y, dx, dy)
            if (padHit) return padHit

            return null
        }
        const ballsPainter = new PainterBalls(context, {
            atlasImage: assets.atlasBalls,
            hit,
        })
        const board = new TgdPainterMesh(context, {
            geometry: new TgdGeometryPlane({ sizeX: 26, sizeY: 26 }),
            material: new TgdMaterialFlat({ color: [0, 0, 0, 1] }),
        })
        context.add(
            new TgdPainterClear(context, {
                color: [0.1, 0.05, 0.025, 1],
                depth: 1,
            }),
            new TgdPainterState(context, {
                depth: webglPresetDepth.lessOrEqual,
                children: [board, bricksPainter, padPainter, ballsPainter],
            }),
            new TgdPainterLogic((time, delay) => {
                if (inputs.right) padPainter.x += 15 * delay
                if (inputs.left) padPainter.x -= 15 * delay
            })
        )
        context.play()
        new TgdControllerCameraOrbit(context, {
            inertiaOrbit: 1000,
        })
        return () => context.delete()
    }
}

export function useGame() {
    const ref = React.useRef<Game | null>(null)
    if (!ref.current) ref.current = new Game()

    return ref.current
}
