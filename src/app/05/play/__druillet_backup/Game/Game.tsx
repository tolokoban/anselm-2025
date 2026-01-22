import React from "react"
import { TgdDataGlb } from "@tolokoban/tgd"

import { useGame } from "./game/index"

import styles from "./Game.module.css"

export interface GameProps {
    className?: string
    assets: {
        glb: TgdDataGlb
        skybox: {
            imagePosX: HTMLImageElement
            imagePosY: HTMLImageElement
            imagePosZ: HTMLImageElement
            imageNegX: HTMLImageElement
            imageNegY: HTMLImageElement
            imageNegZ: HTMLImageElement
        }
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
