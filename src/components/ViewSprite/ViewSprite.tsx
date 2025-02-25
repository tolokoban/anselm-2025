import React from "react"

import styles from "./ViewSprite.module.css"

export interface ViewSpriteProps {
    className?: string
    id: string
    url: string
    zIndex: number
}

export default function ViewSprite({
    className,
    id,
    url,
    zIndex,
}: ViewSpriteProps) {
    return (
        <div
            className={join(className, styles.sprite)}
            id={id}
            style={{
                "--custom-url": `url(${url})`,
                "--custom-z-index": zIndex,
            }}
        />
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
