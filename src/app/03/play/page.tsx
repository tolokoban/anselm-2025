import React from "react"

import Tgd, { Assets } from "@/components/Tgd"
import { TgdContext } from "@tolokoban/tgd"
import { useTranslator } from "@/app/03/_translation"
import Button from "@/components/Button"
import { useGame } from "./_/game"

import imageNegZ from "./_/assets/negZ.webp" // -Z
import imageMiniatureBack from "./_/assets/miniature-1.webp"
import imageMiniatureFront from "./_/assets/miniature-2.webp"
import moonURL from "./_/assets/moon.glb"
import saucerURL from "./_/assets/saucer.glb"
import tunnelURL from "./_/assets/tunnel.glb"
import obstacleURL from "./_/assets/obstacle-1.glb"

import styles from "./page.module.css"
import ViewBook from "@/components/ViewBook"
import { makeGoto } from "@/app/routes"

export default function PagePlay() {
    const [victory, setVictory] = React.useState(false)
    const tr = useTranslator()
    const [initialized, setInitialized] = React.useState(false)
    const game = useGame()
    const handleInit = (context: TgdContext, assets: Assets) => {
        game.init(context, assets, setVictory)
    }
    const handleStart = () => {
        game.start()
        setInitialized(true)
    }

    return (
        <div className={styles.play}>
            <Tgd
                gizmo={false}
                options={{
                    alpha: false,
                }}
                onReady={handleInit}
                assets={{
                    image: {
                        imageNegZ,
                        imageMiniatureBack,
                        imageMiniatureFront,
                    },
                    glb: {
                        moon: moonURL,
                        saucer: saucerURL,
                        tunnel: tunnelURL,
                        obstacle: obstacleURL,
                    },
                }}
            />
            {!initialized && (
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
            <div className={[styles.victory, victory && styles.show].join(" ")}>
                {victory && (
                    <ViewBook pages={[tr.win()]} onDone={makeGoto("/04")} />
                )}
            </div>
        </div>
    )
}
