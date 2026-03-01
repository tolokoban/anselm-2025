import Markdown from "markdown-to-jsx/react"
import type React from "react"

import styles from "./EpisodeSpeech.module.css"
import { useTranslator } from "./translation"
import LanguageSelector from "../LanguageSelector"
import Button from "../Button"
import { makeGoto } from "@/app"

export interface EpisodeSpeechProps {
    className?: string
    mode: "alien" | "mib"
    episode: number
    text: string
    children?: React.ReactNode
}

export default function EpisodeSpeech({
    className,
    mode,
    episode,
    text,
    children,
}: EpisodeSpeechProps) {
    const tr = useTranslator()

    return (
        <div>
            <div
                className={join(className, styles.episodeSpeech, styles[mode])}
            >
                <header>
                    <strong>
                        {tr.episode()} {episode}
                    </strong>
                    <LanguageSelector />
                </header>
                <main>
                    <Markdown>{text}</Markdown>
                </main>
                <footer>{children}</footer>
                <hr />
                <footer>
                    <Button onClick={makeGoto("/")}>{tr.backToMenu()}</Button>
                </footer>
            </div>
        </div>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
