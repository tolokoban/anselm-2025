import React from "react"

import ViewBook from "@/components/ViewBook"
import { makeGoto } from "../routes"
import { pick } from "@/utils/array"
import { MANGE, VACHE } from "@/constants"

export default function PageDead() {
    const score = window.sessionStorage.getItem("score") ?? "0"

    return (
        <ViewBook
            onDone={makeGoto("/play")}
            pages={[
                `${pick([
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
                ])}

Nombre de ${pick(VACHE)} ${pick(MANGE)} : ${score}`,
            ]}
        />
    )
}
