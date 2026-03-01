import React from "react"
import LanguageSelector from "@/components/LanguageSelector"
import Background from "@/generated/background"
import { version } from "@/package.json"
import { Unlocked } from "@/unlocked"
import { IconEpisode01 } from "./_icons/episode01"
import { IconEpisode02 } from "./_icons/episode02"
import { IconEpisode03 } from "./_icons/episode03"
import { IconEpisode04 } from "./_icons/episode04"
import { IconEpisode05 } from "./_icons/episode05"
import { IconEpisode06 } from "./_icons/episode06"
import { useTranslator } from "./_translation"
import styles from "./page.module.css"
import { goto, makeGoto } from "./routes"
import type { RoutePath } from "./types"

const EPISODES: Array<[RoutePath, React.ReactNode]> = [
    ["/01", <IconEpisode01 />],
    ["/02", <IconEpisode02 />],
    ["/03", <IconEpisode03 />],
    ["/04", <IconEpisode04 />],
    ["/05", <IconEpisode05 />],
    ["/06", <IconEpisode06 />],
]

export default function Page() {
    const tr = useTranslator()
    const go = (path: RoutePath) => {
        goto(path)
        document.body.requestFullscreen()
    }

    return (
        <div>
            <div className={styles.main}>
                <Background type="background" />
                <div>
                    <header>
                        <h1>
                            <div>
                                Ansy-2025 <small>(version {version})</small>
                            </div>
                            <LanguageSelector
                                className={styles.languageSelector}
                            />
                        </h1>
                        <p> {tr.intro()} </p>
                    </header>
                    <footer>
                        {EPISODES.map(([route, icon]) => (
                            <button
                                type="button"
                                onClick={makeGoto(route)}
                                disabled={!Unlocked.episode(route)}
                            >
                                {icon}
                                <div>
                                    {tr.episode()} {route.slice(1)}
                                </div>
                            </button>
                        ))}
                    </footer>
                </div>
            </div>
        </div>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
