import { TgdDataGlb, WebglImage } from "@tolokoban/tgd"
import React from "react"

import { useGame } from "./game/index"

import styles from "./Game.module.css"

export interface GameProps {
    className?: string
    assets: {
        atlasBricks: WebglImage
        atlasBalls: WebglImage
    }
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
