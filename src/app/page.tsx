import { goto } from "./routes"

import { IconEpisode01 } from "./_icons/episode01"
import { IconEpisode02 } from "./_icons/episode02"
import { IconEpisode03 } from "./_icons/episode03"
import { IconEpisode04 } from "./_icons/episode04"
import { useTranslator } from "./_translation"
import { RoutePath } from "./types"
import LanguageSelector from "@/components/LanguageSelector"
import { Unlocked } from "@/unlocked"
import Background from "@/generated/background"
import { version } from "@/package.json"

import styles from "./page.module.css"

export default function Page() {
    const tr = useTranslator()
    const go = (path: RoutePath) => {
        goto(path)
        document.body.requestFullscreen()
    }

    return (
        <div className={styles.main}>
            <Background type="background" />
            <div className={styles.scroll}>
                <h1>
                    <div>
                        Ansy-2025 <small>(version {version})</small>
                    </div>
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
                    <button type="button" onClick={() => go("/03")}>
                        <IconEpisode03 />
                        <div>{tr.episode()} 03</div>
                    </button>
                    <button type="button" onClick={() => go("/04")}>
                        <IconEpisode04 />
                        <div>{tr.episode()} 04</div>
                    </button>
                </footer>
            </div>
        </div>
    )
}
