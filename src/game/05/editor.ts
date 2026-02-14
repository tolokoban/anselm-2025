import {
    TgdCameraPerspective,
    TgdContext,
    TgdGeometryPlane,
    TgdMaterialFlatTexture,
    TgdPainterClear,
    TgdPainterGroup,
    TgdPainterMesh,
    tgdCalcDegToRad,
} from "@tolokoban/tgd"
import React from "react"
import { getBackgroundTexture } from "./background"
import type { ArkanoidLevel } from "./levels/types"
import { LogicBricks } from "./logic/bricks"
import { PainterBricks } from "./painters/bricks"
import type { AssetsEdit } from "./types"

class Editor {
    private context: TgdContext | null = null
    private level: ArkanoidLevel | null = null
    private assets: AssetsEdit | null = null
    private readonly painters = new TgdPainterGroup()

    readonly init = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return

        if (this.context) this.context.delete()
        const context = new TgdContext(canvas, {
            alpha: true,
        })
        this.context = context
        context.camera = createCamera()
        context.add(
            new TgdPainterClear(context, {
                color: [0.1, 0.05, 0.025, 1],
                depth: 1,
            }),
            this.painters
        )
        if (this.assets && this.level)
            this.installLevel(this.level, this.assets)
        return () => context.delete()
    }

    installLevel(level: ArkanoidLevel, assets: AssetsEdit) {
        const { context } = this
        if (!context || !assets) {
            this.level = level
            this.assets = assets
            return
        }

        context.camera = createCamera()
        this.painters.removeAll()
        const scale = level.backgroundRepeats ?? 3
        const texture = getBackgroundTexture(context, level)
        const painterBricks = new PainterBricks(context, {
            atlasImage: assets.atlasBricks,
        })
        const logicBricks = new LogicBricks(painterBricks)
        logicBricks.level = level
        this.painters.add(
            new TgdPainterMesh(context, {
                transfo: {
                    position: [0, 0, -1e-1],
                },
                geometry: new TgdGeometryPlane({
                    sizeX: 26,
                    sizeY: 26,
                    uv1: [scale, scale],
                }),
                material: new TgdMaterialFlatTexture({ texture }),
            }),
            painterBricks
        )
        context.paint()
    }
}

function createCamera() {
    return new TgdCameraPerspective({
        far: 100,
        near: 1,
        fovy: tgdCalcDegToRad(90),
        transfo: {
            distance: 0,
            position: [0, 0, 13],
        },
    })
}

export function useEditor() {
    const ref = React.useRef<Editor | null>(null)
    if (!ref.current) ref.current = new Editor()

    return ref.current
}
