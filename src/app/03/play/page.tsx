import React from "react"

import Tgd, { Assets } from "@/components/Tgd"
import { TgdContext } from "@tolokoban/tgd"
import { useTranslator } from "@/app/03/_translation"
import Button from "@/components/Button"
import { useGame } from "./_/game"

import imageNegZ from "./_/negZ.webp" // -Z
import moonURL from "./_/moon.glb"
import saucerURL from "./_/saucer.glb"

import styles from "./page.module.css"

export default function PagePlay() {
    const tr = useTranslator()
    const [initialized, setInitialized] = React.useState(false)
    const game = useGame()
    const handleInit = (context: TgdContext, assets: Assets) => {
        game.init(context, assets)
    }
    const handleStart = () => {
        game.start()
        setInitialized(true)
    }

    return (
        <div className={styles.play}>
            <Tgd
                gizmo={false}
                onReady={handleInit}
                assets={{
                    image: { imageNegZ },
                    glb: {
                        moon: moonURL,
                        saucer: saucerURL,
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
        </div>
    )
}
