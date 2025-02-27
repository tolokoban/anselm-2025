import React from "react"

import ViewBook from "@/components/ViewBook"
import { goto } from "../../routes"
import { pick } from "@/utils/array"
import { MANGE, VACHE } from "@/constants"
import { getHighscore, setHighscore } from "@/highscore"

export default function PageDead() {
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
                `${pick([
                    "Ouch... Tu t'es bien explosé, là !",
                    "Tu t'es crashé en beauté !",
                    "Tu as brouté les marguerites !",
                    "La gravité t'a rattrappé !",
                    "T'as fait bobo à mon vaisseau !",
                    "Oh ! Ça doit faire mal ça !",
                    "T'es sūr d'avoir ton permis ?",
                    "On va dire qu'on n'a rien vu...",
                    "Hey ! Tu sais combien ça coūte une soucoupe ?",
                    "Tu as rayé la peinture là !",
                    "Rapelle-moi de ne jamais monter avec toi dans un vaisseau...",
                    "Tu as heurté le plancher des vaches !",
                    "Boum ! Dans ta face !",
                    "Alors c'est mon garagiste qui va être content...",
                ])}

Nombre de ${pick(VACHE)}s ${pick(MANGE)}s : ${score}

${
    score > highscore
        ? pick([
              "C'est un nouveau record !!!",
              "Ancien record pulvérisé !!!",
              "Tu progresse ! Bravo !!!",
              "Eh hop ! Nouveau record !!!",
              "Tu progresses trop bien !!!",
              score < 100
                  ? `Youpi ! Plus que ${100 - score}...`
                  : "C'est stratosphérique !!!",
          ])
        : pick([
              `Ancien record : ${highscore}`,
              `Tu as déjà réussi à en prendre ${highscore}`,
              `Essaie de faire mieux que ${highscore}`,
              `Pourras-tu battre ${highscore} ?`,
          ])
}`,
            ]}
        />
    )
}
