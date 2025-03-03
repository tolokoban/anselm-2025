import React from "react"

import styles from "./Button.module.css"

export interface ButtonProps {
    className?: string
    disabled?: boolean
    onClick(): void
    children: React.ReactNode
}

export default function Button({
    className,
    disabled,
    onClick,
    children,
}: ButtonProps) {
    return (
        <button
            type="button"
            className={join(className, styles.button)}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
