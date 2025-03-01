import React from "react"

import ViewBook from "@/components/ViewBook"
import { goto } from "../../routes"
import { pick } from "@/utils/array"
import { getHighscore, setHighscore } from "@/highscore"
import { useTranslator } from "../_translation"

export default function PageDead() {
    const tr = useTranslator()
    const score = Number(window.sessionStorage.getItem("score") ?? "0")
    const highscore = getHighscore()
    const handleClick = () => {
        setHighscore(score)
        goto("/01/play")
    }

    return (
        <ViewBook
            onDone={handleClick}
            pages={[
                `${tr.gameOver()}

${tr.score(`${tr.scoreCow()}s`, `${tr.scoreEat()}s`)} : ${score}

${score > highscore ? tr.congrats() : tr.highscore(`${highscore}`)}`,
            ]}
        />
    )
}
