import React from "react"

import styles from "./ViewEnergyBar.module.css"

export interface ViewEnergyBarProps {
    className?: string
}

export default function ViewEnergyBar({ className }: ViewEnergyBarProps) {
    return (
        <div className={join(className, styles.viewEnergyBar)}>
            <div className={styles.level} id="energy-level" />
            <div className={styles.border} />
        </div>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
