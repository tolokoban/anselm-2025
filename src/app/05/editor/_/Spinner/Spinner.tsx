import React from "react"

import styles from "./Spinner.module.css"
import { useContext } from "./context"
import { useTranslator } from "@/app/05/_translation"

export interface SpinnerProps {
    className?: string
}

export default function Spinner({ className }: SpinnerProps) {
    const tr = useTranslator()
    const context = useContext(tr.loading())

    return (
        <canvas
            className={join(className, styles.spinner)}
            ref={(canvas) => context.init(canvas)}
        ></canvas>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
