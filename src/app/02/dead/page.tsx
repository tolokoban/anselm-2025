import React from "react"

import { useTranslator } from "../_translation"
import ViewBook from "@/components/ViewBook"
import { goto } from "@/app/routes"
import { GameStorage } from "@/storage"

export default function PageDead() {
    const tr = useTranslator()
    const messages = [
        tr.dead1(),
        tr.dead2(),
        tr.dead3(),
        tr.dead4(),
        tr.dead5(),
        tr.dead6(),
    ]
    const text =
        messages[
            Math.max(0, Math.min(GameStorage.ep02.losses, messages.length - 1))
        ]
    return (
        <ViewBook
            onDone={() => {
                GameStorage.ep02.losses++
                goto("/02/play")
            }}
            pages={[text]}
        />
    )
}
