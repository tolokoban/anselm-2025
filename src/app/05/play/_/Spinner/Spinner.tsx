import React from "react"

import styles from "./Spinner.module.css"

export interface SpinnerProps {
    className?: string
}

export default function Spinner({ className }: SpinnerProps) {
    return <div className={join(className, styles.spinner)}>Loading...</div>
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
