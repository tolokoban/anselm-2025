import React from "react"

import styles from "./Button.module.css"
import { classNames } from "@/utils/class-names"

export interface ButtonProps {
    className?: string
    autoFocus?: boolean
    onClick(): void
    children: React.ReactNode
}

export default function Button({
    className,
    autoFocus,
    onClick,
    children,
}: ButtonProps) {
    return (
        <button
            type="button"
            autoFocus={autoFocus}
            className={classNames(className, styles.button)}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
