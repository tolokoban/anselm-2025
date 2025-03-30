import { goto } from "./routes"

import { IconEpisode01 } from "./_icons/episode01"
import { IconEpisode02 } from "./_icons/episode02"
import { useTranslator } from "./_translation"
import LanguageSelector from "@/components/LanguageSelector"

import styles from "./page.module.css"
import { RoutePath } from "./types"
import { Unlocked } from "@/unlocked"
import Background from "@/generated/background"

export default function Page() {
    const tr = useTranslator()
    const go = (path: RoutePath) => {
        goto(path)
        document.body.requestFullscreen()
    }

    return (
        <div className={styles.main}>
            <Background type="background" />
            <h1>
                <div>Ansy-2025</div>
                <LanguageSelector className={styles.languageSelector} />
            </h1>
            <p> {tr.intro()} </p>
            <footer>
                <button type="button" onClick={() => go("/01")}>
                    <IconEpisode01 />
                    <div>{tr.episode()} 01</div>
                </button>
                <button
                    type="button"
                    onClick={() => go("/02")}
                    disabled={!Unlocked.ep02}
                >
                    <IconEpisode02 />
                    <div>{tr.episode()} 02</div>
                </button>
            </footer>
        </div>
    )
}
