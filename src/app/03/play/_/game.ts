import { Assets } from "@/components/Tgd"
import {
    tgdActionCreateTransfoInterpolation,
    tgdAnimChainTransfoInterpolations,
    tgdCalcDegToRad,
    tgdCalcMix,
    TgdCameraPerspective,
    tgdCanvasCreateFill,
    TgdContext,
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
import { Tunnel } from "./tunnel"
import { Obstacle } from "./obstacle"

export function useGame() {
    const ref = React.useRef<Game | null>(null)
    if (!ref.current) ref.current = new Game()
    return ref.current as Game
}

class Game {
    private context: TgdContext | null = null
    private onIntroEnd: null | (() => void) = null
    private saucer: Saucer | null = null

    readonly init = (context: TgdContext, assets: Assets) => {
        this.context = context
        const saucer = new Saucer(context, assets.glb.saucer)
        saucer.node.transfo.setPosition(0, 180, 0)
        this.saucer = saucer
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
            cull: webglPresetCull.back,
            children: [moon, saucer.node, skybox],
        })
        context.add(clear, state)
        context.play()
        this.onIntroEnd = () => {
            state.remove(moon, skybox)
            const tunnel = new Tunnel(context, assets.glb.tunnel)
            const obstacles = [
                new Obstacle(context, assets.glb.obstacle),
                new Obstacle(context, assets.glb.obstacle, 0.25),
                new Obstacle(context, assets.glb.obstacle, 0.5),
                new Obstacle(context, assets.glb.obstacle, 0.75),
            ]
            state.add(tunnel, ...obstacles)
            context.animSchedule({
                duration: 0.2,
                action: tgdActionCreateTransfoInterpolation(
                    saucer.node.transfo,
                    { scale: saucer.node.transfo.scale.clone() },
                    { scale: [0.5, 0.5, 0.5] }
                ),
            })
            context.animSchedule({
                delay: 0.2,
                duration: 2,
                easingFunction: tgdEasingFunctionInOutCubic,
                action: (alpha) => {
                    tunnel.light = alpha
                },
            })
        }
    }

    readonly start = () => {
        const { context, saucer } = this
        if (!context) return

        const animationDuration = 1
        if (saucer) {
            context.animSchedule(
                tgdAnimChainTransfoInterpolations(saucer.node.transfo, [
                    {
                        duration: 3 * animationDuration,
                        transfo: {
                            position: [0, 100, 0],
                        },
                    },
                    {
                        duration: 1 * animationDuration,
                        transfo: {
                            position: [0, 0, 0],
                        },
                    },
                ])
            )
        }
        context.animSchedule(
            tgdAnimChainTransfoInterpolations(context.camera.transfo, [
                {
                    duration: 3 * animationDuration,
                    easingFunction: tgdEasingFunctionOutCubic,
                    transfo: {
                        distance: 150,
                        orientation: new TgdQuat(),
                        position: new TgdVec3(0, 120, 0),
                    },
                },
                {
                    duration: 1 * animationDuration,
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
                    duration: 1 * animationDuration,
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
                    duration: 0.6 * animationDuration,
                    transfo: {
                        distance: 20,
                        orientation: new TgdQuat(),
                        position: [0, 4, 0],
                        scale: [1, 1, 1],
                    },
                },
            ])
        )
        context.animSchedule({
            duration: 2 * animationDuration,
            easingFunction: tgdEasingFunctionOutQuad,
            action(t) {
                context.camera.zoom = tgdCalcMix(3, 1, t)
            },
        })
    }
}
