import { ArkanoidLevels } from "@/game/05/levels"
import { PainterBalls } from "@/game/05/painters/balls"
import { PainterBricks } from "@/game/05/painters/bricks"
import {
    TgdContext,
    TgdControllerCameraOrbit,
    TgdGeometryPlane,
    TgdMaterialFlat,
    TgdPainterBackground,
    TgdPainterClear,
    TgdPainterMesh,
    TgdPainterState,
    TgdTexture2D,
    WebglImage,
    tgdCalcModulo,
    tgdCalcRandom,
    webglPresetCull,
    webglPresetDepth,
} from "@tolokoban/tgd"
import React from "react"

class Game {
    readonly init = (
        canvas: HTMLCanvasElement | null,
        assets: {
            atlasBricks: WebglImage
            atlasBalls: WebglImage
        }
    ) => {
        if (!canvas) return

        const context = new TgdContext(canvas, {
            alpha: true,
        })
        const { camera } = context
        camera.near = 0.01
        camera.far = 1000
        camera.fitSpaceAtTarget(28, 28)
        const bricksPainter = new PainterBricks(context, {
            atlasImage: assets.atlasBricks,
            level: ArkanoidLevels[0],
        })
        const hit = (x: number, y: number, dx: number, dy: number) => {
            return bricksPainter.hit(x, y, dx, dy)
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
                children: [board, bricksPainter, ballsPainter],
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
