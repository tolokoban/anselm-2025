import { Assets } from "@/components/Tgd"
import {
    tgdActionCreateCameraInterpolation,
    tgdAnimChainTransfoInterpolations,
    tgdCalcDegToRad,
    tgdCalcMix,
    TgdCameraPerspective,
    tgdCanvasCreateFill,
    TgdContext,
    TgdControllerCameraOrbit,
    tgdEasingFunctionInOutCubic,
    tgdEasingFunctionOutCubic,
    tgdEasingFunctionOutQuad,
    TgdPainterClear,
    TgdPainterSkybox,
    TgdPainterState,
    TgdQuat,
    TgdVec3,
    webglPresetCull,
    webglPresetDepth,
} from "@tolokoban/tgd"
import React from "react"

import { Moon } from "./moon"
import { Saucer } from "./saucer"

export function useGame() {
    const ref = React.useRef<Game | null>(null)
    if (!ref.current) ref.current = new Game()
    return ref.current as Game
}

class Game {
    private context: TgdContext | null = null
    private onIntroEnd: null | (() => void) = null

    readonly init = (context: TgdContext, assets: Assets) => {
        this.context = context
        const saucer = new Saucer(context, assets.glb.saucer)
        context.camera.from(
            new TgdCameraPerspective({
                fovy: tgdCalcDegToRad(40),
                near: 0.01,
                far: 1000,
                zoom: 2.5421269851440123,
                transfo: {
                    distance: 0,
                    position: [0, 300, -300],
                    orientation: [
                        0.341026246547699, -0.19848087430000305,
                        -0.5130870938301086, 0.7622650861740112,
                    ],
                    scale: [
                        2.5421268939971924, 2.5421268939971924,
                        2.5421268939971924,
                    ],
                },
            })
        )
        const { width, height } = assets.image.imageNegZ
        const black = tgdCanvasCreateFill(width, height)
        new TgdControllerCameraOrbit(context)
        const skybox = new TgdPainterSkybox(context, {
            camera: context.camera,
            imagePosX: black,
            imagePosY: black,
            imagePosZ: black,
            imageNegX: black,
            imageNegY: black,
            imageNegZ: assets.image.imageNegZ,
        })
        const moon = new Moon(context, assets.glb.moon)
        const clear = new TgdPainterClear(context, {
            depth: 1,
            color: [0, 0, 0, 1],
        })
        const state = new TgdPainterState(context, {
            depth: webglPresetDepth.lessOrEqual,
            cull: webglPresetCull.off,
            children: [moon, saucer.node, skybox],
        })
        context.add(clear, state)
        context.play()
        this.onIntroEnd = () => {
            state.remove(moon, skybox)
        }
    }

    readonly start = () => {
        const { context } = this
        if (!context) return

        context.animSchedule(
            tgdAnimChainTransfoInterpolations(context.camera.transfo, [
                {
                    duration: 3,
                    easingFunction: tgdEasingFunctionOutCubic,
                    transfo: {
                        distance: 150,
                        orientation: new TgdQuat(),
                        position: new TgdVec3(0, 120, 0),
                    },
                },
                {
                    duration: 1,
                    easingFunction: tgdEasingFunctionInOutCubic,
                    transfo: {
                        distance: 0,
                        position: new TgdVec3(0, 90, 0),
                        orientation: new TgdQuat(
                            -0.5914373993873596,
                            0.287754625082016,
                            0.3368068337440491,
                            0.6737657189369202
                        ),
                    },
                },
                {
                    duration: 0.6,
                    easingFunction: tgdEasingFunctionInOutCubic,
                    transfo: {
                        distance: 20,
                        position: new TgdVec3(0, 0, 0),
                        orientation: new TgdQuat(
                            -0.5914373993873596,
                            0.287754625082016,
                            0.3368068337440491,
                            0.6737657189369202
                        ),
                    },
                    onEnd: () => {
                        this.onIntroEnd?.()
                    },
                },
                {
                    duration: 0.3,
                    transfo: {
                        orientation: new TgdQuat(),
                        position: [0, 0, 0],
                    },
                },
            ])
        )
        context.animSchedule({
            duration: 2,
            easingFunction: tgdEasingFunctionOutQuad,
            action(t) {
                context.camera.zoom = tgdCalcMix(3, 1, t)
            },
        })
    }
}
