import React from "react"

import { Game, gameIsVictory } from "../logic"
import { useTranslator } from "@/app/04/_translation"

import styles from "./Victory.module.css"
import { makeGoto } from "@/app/routes"

export interface VictoryProps {
    className?: string
    game: Game
}

export default function Victory({ className, game }: VictoryProps) {
    const tr = useTranslator()
    return (
        <button
            type="button"
            disabled={!gameIsVictory(game)}
            className={join(
                className,
                styles.victory,
                gameIsVictory(game) && styles.show
            )}
            onClick={makeGoto("/04/win")}
        >
            <div>
                <div>{tr.victory()}</div>
            </div>
        </button>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
