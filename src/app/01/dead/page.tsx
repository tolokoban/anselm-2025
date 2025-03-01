import React from "react"

import ViewBook from "@/components/ViewBook"
import { goto } from "../../routes"
import { useTranslator } from "../_translation"
import { GameStorage } from "@/storage"
import { Unlocked } from "@/unlocked"

export default function PageDead() {
    const tr = useTranslator()
    const score = Number(window.sessionStorage.getItem("score") ?? "0")
    const highscore = GameStorage.ep01.highscore
    const handleClick = () => {
        GameStorage.ep01.highscore = score
        GameStorage.ep01.total += score
        goto(!Unlocked.ep02 ? "/01/play" : "/02")
    }

    return (
        <ViewBook
            onDone={handleClick}
            pages={[
                `${tr.gameOver()}

${tr.score(tr.scoreCows(), tr.scoreEats())} : ${score}

${score > highscore ? tr.congrats() : tr.highscore(`${highscore}`)}`,
            ]}
        />
    )
}
