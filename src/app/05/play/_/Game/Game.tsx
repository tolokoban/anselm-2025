import React from "react"
import { useTranslator } from "@/app/05/_translation"
import { useGame } from "@/game/05/game"
import { StateArkanoid } from "@/game/05/levels"
import type { Assets } from "@/game/05/types"
import { classNames } from "@/utils/class-names"
import styles from "./Game.module.css"

export interface GameProps {
    className?: string
    assets: Assets
}

export default function Game({ className, assets }: GameProps) {
    const tr = useTranslator()
    const lifes = StateArkanoid.lifes.useValue()
    console.log("🐞 [Game@18] lifes =", lifes) // @FIXME: Remove this line written on 2026-02-27 at 19:42

    return (
        <div className={join(className, styles.game)}>
            <div>
                <header>
                    <div>{tr.lifes()}</div>
                    <div>
                        {[3, 2, 1].map((life) => (
                            <div
                                className={classNames(
                                    styles.life,
                                    life > lifes && styles.dead
                                )}
                                key={life}
                            />
                        ))}
                    </div>
                </header>
                <main></main>
                <footer>
                    <button id="btn-left" type="button">
                        &lt;
                    </button>
                </footer>
            </div>
            <Canvas assets={assets} />
            <div>
                <header>
                    <div>{tr.lifes()}</div>
                    <div>
                        {[3, 2, 1].map((life) => (
                            <div
                                className={classNames(
                                    styles.life,
                                    life > lifes && styles.dead
                                )}
                                key={life}
                            />
                        ))}
                    </div>
                </header>
                <main></main>
                <footer>
                    <button id="btn-right" type="button">
                        &gt;
                    </button>
                </footer>
            </div>
        </div>
    )
}

const Canvas = React.memo(({ assets }: { assets: Assets }) => {
    React.useEffect(() => {
        StateArkanoid.lifes.value = 3
    }, [])
    const game = useGame()

    return <canvas ref={(canvas) => game.init(canvas, assets)}></canvas>
})

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
