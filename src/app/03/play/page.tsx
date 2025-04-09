import React from "react"

import Tgd, { Assets } from "@/components/Tgd"
import {
    TgdContext,
    TgdControllerCameraOrbit,
    TgdPainterClear,
    TgdPainterState,
    webglPresetDepth,
} from "@tolokoban/tgd"
import { useTranslator } from "@/app/03/_translation"
import Button from "@/components/Button"
import { useGame } from "./_/game"

import imageNegZ from "./_/negZ.webp" // -Z
import moonURL from "./_/moon.glb"
import saucerURL from "./_/saucer.glb"
import tunnelURL from "./_/tunnel.glb"
import obstacleURL from "./_/obstacle-1.glb"

import styles from "./page.module.css"
import { Obstacle } from "./_/obstacle"

export default function PagePlay() {
    const test = false
    const tr = useTranslator()
    const [initialized, setInitialized] = React.useState(false)
    const game = useGame()
    const handleInit = (context: TgdContext, assets: Assets) => {
        if (test) initForTesting(context, assets)
        else game.init(context, assets)
    }
    const handleStart = () => {
        game.start()
        setInitialized(true)
    }

    return (
        <div className={styles.play}>
            <Tgd
                gizmo={test}
                onReady={handleInit}
                assets={{
                    image: { imageNegZ },
                    glb: {
                        moon: moonURL,
                        saucer: saucerURL,
                        tunnel: tunnelURL,
                        obstacle: obstacleURL,
                    },
                }}
            />
            {!initialized && !test && (
                <div className={styles.startScreen}>
                    <Button
                        className={styles.startButton}
                        onClick={handleStart}
                        autoFocus
                    >
                        {tr.start()}
                    </Button>
                </div>
            )}
        </div>
    )
}

function initForTesting(context: TgdContext, assets: Assets) {
    const obstacle = new Obstacle(context, assets.glb.obstacle)
    context.add(
        new TgdPainterClear(context, { color: [0, 0, 0, 1] }),
        new TgdPainterState(context, {
            depth: webglPresetDepth.lessOrEqual,
            children: [obstacle],
        })
    )
    context.camera.transfo.distance = 20
    new TgdControllerCameraOrbit(context, { inertiaOrbit: 1000 })
    context.play()
}

