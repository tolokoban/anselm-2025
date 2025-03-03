import React from "react"

import ViewBook from "@/components/ViewBook"
import { useTranslator } from "../_translation"
import { makeGoto } from "@/app/routes"

export default function PageHelp() {
    const tr = useTranslator()
    return <ViewBook pages={[tr.help()]} onDone={makeGoto("/02/play")} />
}
