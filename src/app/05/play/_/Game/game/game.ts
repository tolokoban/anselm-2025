import React from "react"
import {
    tgdCalcModulo,
    tgdCalcRandom,
    TgdContext,
    TgdControllerCameraOrbit,
    TgdDataGlb,
    TgdPainterClear,
    TgdPainterState,
    webglPresetCull,
    webglPresetDepth,
} from "@tolokoban/tgd"
import { PainterDisk, PainterDiskPosition } from "./decor/disk"
import { PainterBar, PainterBarPosition } from "./decor/disk/bar"

class Game {
    readonly init = (
        canvas: HTMLCanvasElement | null,
        assets: {
            glb: TgdDataGlb
            skybox: {
                imagePosX: HTMLImageElement
                imagePosY: HTMLImageElement
                imagePosZ: HTMLImageElement
                imageNegX: HTMLImageElement
                imageNegY: HTMLImageElement
                imageNegZ: HTMLImageElement
            }
        }
    ) => {
        if (!canvas) return

        const context = new TgdContext(canvas)
        const { camera } = context
        camera.near = 1
        camera.far = 100000
        camera.transfo.distance = 50
        camera.transfo.setEulerRotation(-10, 0, 0)
        new TgdControllerCameraOrbit(context, {
            inertiaOrbit: 1000,
        })
        const posDisk: PainterDiskPosition[] = []
        const posBar: PainterBarPosition[] = []
        let distance1 = 0
        let angle1 = 110
        let distance2 = 0
        let angle2 = 0
        for (let loop = 0; loop < 50; loop++) {
            distance1 = 0
            angle1 = tgdCalcRandom(360)
            for (let i = 0; i < 10; i++) {
                distance2 = distance1 + tgdCalcRandom(10, 40)
                angle2 = angle1 + tgdCalcRandom(-120, 120)
                posDisk.push([angle1, distance1, loop])
                posBar.push([angle1, distance1, loop, angle2, distance2, loop])
                distance1 = distance2
                angle1 = angle2
            }
        }
        const meshDisk = new PainterDisk(context, assets, "Disk1", posDisk)
        const meshBar = new PainterBar(context, assets, "Bar1", posBar)
        context.add(
            new TgdPainterState(context, {
                depth: webglPresetDepth.less,
                cull: webglPresetCull.back,
                children: [
                    new TgdPainterClear(context, {
                        color: [0.0, 0.0, 0.0, 1],
                        depth: 1,
                    }),
                    meshDisk,
                    meshBar,
                ],
            })
        )
        context.logic.add((time) => {
            const shift = tgdCalcModulo(time * 2, 0, 200)
            meshDisk.shift = shift
            meshBar.shift = shift
        })
        context.play()
        return () => context.delete()
    }
}

export function useGame() {
    const ref = React.useRef<Game | null>(null)
    if (!ref.current) ref.current = new Game()

    return ref.current
}
