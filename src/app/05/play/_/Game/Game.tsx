import React from "react"

import styles from "./Game.module.css"
import { TgdDataGlb } from "@tolokoban/tgd"
import { useGame } from "./game"

export interface GameProps {
    className?: string
    assets: { glb: TgdDataGlb }
}

export default function Game({ className, assets }: GameProps) {
    const game = useGame()

    return (
        <canvas
            className={join(className, styles.game)}
            ref={(canvas) => game.init(canvas, assets)}
        ></canvas>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
