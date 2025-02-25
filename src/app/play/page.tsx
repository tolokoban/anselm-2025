import React from "react"
import { Engine } from "@/engine/engine"
import LandscapeView from "@/components/LandscapeView"
import Sprite from "@/components/ViewSprite"

import SpaceshipURL from "@/gfx/spaceship.png"

import styles from "./page.module.css"
import ViewEnergyBar from "@/components/ViewEnergyBar"

export default function Page() {
    const refContainer = React.useRef<HTMLDivElement | null>(null)
    const engine = Engine.use()

    return (
        <LandscapeView onMount={engine.attach}>
            <div className={styles.page}>
                {[0, 1, 2, 3].map((index) => (
                    <div
                        className={styles.hill}
                        style={{
                            bottom: `${Math.sqrt(index) * 10}vmin`,
                            zIndex: `${10 * (9 - index)}`,
                            transform: `scale(${1 - index * 0.2})`,
                            animationDuration: `${3 + index * 5.0}s`,
                            filter: `brightness(${index * 0.3 + 0.1})`,
                        }}
                    />
                ))}
                <div id="sprite-spaceship">
                    <div id="sprite-spaceship-laser" />
                    <Sprite
                        id="sprite-spaceship-main"
                        url={SpaceshipURL}
                        zIndex={75}
                    />
                </div>
                <ViewEnergyBar />
            </div>
        </LandscapeView>
    )
}
