import {
    TgdCameraPerspective,
    TgdContext,
    TgdPainterClear,
    TgdPainterGroup,
    TgdPainterGroupCamera,
    tgdCalcDegToRad,
    tgdCalcMix,
    tgdEasingFunctionInOutBounce,
    tgdEasingFunctionInOutElastic,
} from "@tolokoban/tgd"
import React from "react"

import { makeLevelPainterAndLogic } from "./factory"
import type { Assets } from "./types"

class Game {
    private levelIndex = 0
    private context: TgdContext | null = null
    private assets: Assets | null = null
    private readonly painters = new TgdPainterGroup()
    private readonly logics = new TgdPainterGroup()

    readonly init = (canvas: HTMLCanvasElement | null, assets: Assets) => {
        if (!canvas) return

        if (this.context) this.context.delete()
        this.assets = assets
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
            this.painters,
            this.logics
        )
        this.installLevel()
        return () => context.delete()
    }

    installLevel() {
        const { context, assets } = this
        if (!context || !assets) return

        const camera1 = createCamera()
        const { painter: painter1, logic: logic1 } = makeLevelPainterAndLogic(
            context,
            assets,
            this.levelIndex
        )
        const camera2 = createCamera()
        camera2.transfo.setEulerRotation(0, 90, 0)
        const { painter: painter2 } = makeLevelPainterAndLogic(
            context,
            assets,
            this.levelIndex + 1
        )
        this.painters.removeAll()
        this.logics.removeAll()
        this.painters.add(
            new TgdPainterGroupCamera(context, {
                camera: camera1,
                children: [painter1],
            }),
            new TgdPainterGroupCamera(context, {
                camera: camera2,
                children: [painter2],
            })
        )
        this.logics.add(logic1)
        logic1.eventVictory.addListener(() => {
            context.pause()
            this.logics.removeAll()
            context.animSchedule({
                delay: 0.5,
                duration: 1.5,
                action(t) {
                    camera1.transfo.setEulerRotation(
                        0,
                        tgdCalcMix(0, -90, t),
                        0
                    )
                    camera2.transfo.setEulerRotation(0, tgdCalcMix(90, 0, t), 0)
                },
                onEnd: () => {
                    this.levelIndex++
                    this.installLevel()
                },
                easingFunction: tgdEasingFunctionInOutElastic,
            })
            context.play()
        })
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

export function useGame() {
    const ref = React.useRef<Game | null>(null)
    if (!ref.current) ref.current = new Game()

    return ref.current
}
