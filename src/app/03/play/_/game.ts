import { Assets } from "@/components/Tgd"
import {
    tgdActionCreateTransfoInterpolation,
    tgdAnimChainTransfoInterpolations,
    tgdCalcDegToRad,
    tgdCalcMix,
    TgdCameraPerspective,
    TgdContext,
    tgdEasingFunctionInOutCubic,
    tgdEasingFunctionOutCubic,
    tgdEasingFunctionOutQuad,
    TgdQuat,
    TgdVec3,
} from "@tolokoban/tgd"
import React from "react"

import { Actors } from "./actors"

export function useGame() {
    const ref = React.useRef<Game | null>(null)
    if (!ref.current) ref.current = new Game()
    return ref.current as Game
}

class Game {
    private actors: Actors | null = null
    private context: TgdContext | null = null
    private time0 = 0

    readonly init = (context: TgdContext, assets: Assets) => {
        const actors = new Actors(context, assets)
        this.actors = actors
        this.context = context
        this.reset()
        context.play()
    }

    readonly stepTransitionFromExteriorToInterior = () => {
        const { context, actors } = this
        if (!context || !actors) return

        const { saucer, tunnel } = actors
        saucer.mode = "interactive"
        actors.step = "interior"
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
        this.time0 = -1
        actors.obstacles.time0 = this.time0
        context.logicClear()
        context.logicAdd(this.logicTunnelRun)

        console.log("🚀 [game] context.time =", context.time) // @FIXME: Remove this line written on 2025-06-15 at 19:29
    }

    readonly reset = () => {
        const { context, actors } = this
        if (!context || !actors) return

        const { saucer } = actors
        actors.step = "exterior"
        saucer.active = true
        saucer.node.transfo.setPosition(0, 180, 0)
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
    }

    readonly start = () => {
        const { context, actors } = this
        if (!context || !actors) return

        console.log("Started!")
        context.debugHierarchy()
        const animationDuration = 1
        const { saucer } = actors
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
                    onEnd: this.stepTransitionFromExteriorToInterior,
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

    readonly logicTunnelRun = (time: number, delay: number) => {
        const { actors } = this
        if (!actors) return

        if (this.time0 < 0) this.time0 = time
        time -= this.time0
        const speed = 100 + time * 1
        actors.tunnel.move = time * speed
        actors.obstacles.speed = speed
    }
}
