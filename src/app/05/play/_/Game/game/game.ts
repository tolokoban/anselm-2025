import React from "react"
import {
    TgdContext,
    TgdControllerCameraOrbit,
    TgdDataGlb,
    TgdPainterClear,
    TgdPainterMeshGltf,
    TgdPainterState,
    webglPresetBlend,
    webglPresetCull,
    webglPresetDepth,
} from "@tolokoban/tgd"
import { PainterDisk } from "./decor/disk"

class Game {
    readonly init = (
        canvas: HTMLCanvasElement | null,
        assets: {
            glb: TgdDataGlb
        }
    ) => {
        if (!canvas) return

        const context = new TgdContext(canvas)
        new TgdControllerCameraOrbit(context, {
            inertiaOrbit: 1000,
        })
        const mesh = new PainterDisk(context, assets.glb)
        context.add(
            new TgdPainterState(context, {
                depth: webglPresetDepth.less,
                cull: webglPresetCull.back,
                children: [
                    new TgdPainterClear(context, {
                        color: [0.2, 0.1, 0.0, 1],
                        depth: 1,
                    }),
                    mesh,
                ],
            })
        )
        context.play()
        return () => context.delete()
    }
}

export function useGame() {
    const ref = React.useRef<Game | null>(null)
    if (!ref.current) ref.current = new Game()

    return ref.current
}
