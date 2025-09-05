import React from "react"

import { useTranslator } from "@/app/04/_translation"

import BigURL from "./tutorial.webp"
import SmallURL from "./tutorial.small.webp"

import styles from "./Help.module.css"

export interface HelpProps {
    className?: string
}

export default function Help({ className }: HelpProps) {
    const tr = useTranslator()
    const [open, setOpen] = React.useState(false)
    const toggle = () => {
        setOpen(!open)
    }

    return (
        <div className={join(className, styles.help, open && styles.open)}>
            <header>
                <button type="button" onClick={toggle}>
                    {tr.helpButton()}
                </button>
            </header>
            <main>
                <p>{tr.help()}</p>
                <img
                    alt={tr.helpButton()}
                    srcSet={`${BigURL} 1920w, ${SmallURL} 960w`}
                    sizes="(width > 960) 1920px, (height > 960) 1920px, 96px"
                />
                <footer>
                    <button type="button" onClick={toggle}>
                        {tr.gotIt()}
                    </button>
                </footer>
            </main>
        </div>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
