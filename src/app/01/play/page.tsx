import React from "react"
import { Engine } from "@/game/01/engine/engine"
import LandscapeView from "@/components/LandscapeView"
import Sprite from "@/components/ViewSprite"
import ViewEnergyBar from "@/components/ViewEnergyBar"

import SpaceshipURL from "@/gfx/spaceship.webp"
import CowURL from "@/gfx/cow.webp"

import styles from "./page.module.css"
import { useTranslator } from "../_translation"

export default function Page() {
    const tr = useTranslator()
    const engine = Engine.use(tr)

    return (
        <LandscapeView onMount={engine.attach}>
            <div className={styles.page}>
                {[0, 1, 2, 3].map((index) => {
                    const s = 1 - index * 0.2
                    return (
                        <div
                            className={styles.hill}
                            style={{
                                bottom: `${Math.sqrt(index) * 10}vmin`,
                                zIndex: `${10 * (9 - index)}`,
                                transform: `scale(${s})`,
                                animationDuration: `${3 + index * 5.0}s`,
                                filter: `brightness(${index * 0.3 + 0.2})`,
                            }}
                        />
                    )
                })}
                <div id="sprite-spaceship">
                    <div id="sprite-spaceship-laser" />
                    <Sprite
                        id="sprite-spaceship-main"
                        url={SpaceshipURL}
                        zIndex={81}
                    />
                </div>
                <Sprite id="sprite-cow" url={CowURL} zIndex={80} />
                <ViewEnergyBar />
                <div id="score" />
            </div>
        </LandscapeView>
    )
}
