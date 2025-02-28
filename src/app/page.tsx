import { goto } from "./routes"

import { IconEpisode01 } from "./_icons/epidose01"
import { useTranslation } from "./_translation"
import LanguageSelector from "@/components/LanguageSelector"

import styles from "./page.module.css"

export default function Page() {
    const tr = useTranslation()
    const handleClick = () => {
        goto("/01")
        document.body.requestFullscreen()
    }

    return (
        <div className={styles.main}>
            <h1>
                <div>Ansy-2025</div>
                <LanguageSelector className={styles.languageSelector} />
            </h1>
            <p> {tr.intro} </p>
            <footer>
                <button type="button" onClick={handleClick}>
                    <IconEpisode01 />
                    <div>{tr.episode} 01</div>
                </button>
            </footer>
        </div>
    )
}
