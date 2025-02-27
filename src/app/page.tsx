import { goto } from "./routes"

import styles from "./page.module.css"

export default function Page() {
    const handleClick = () => {
        goto("/01")
        document.body.requestFullscreen()
    }

    return (
        <div className={styles.main}>
            <button type="button" onClick={handleClick}>
                Jouer
            </button>
        </div>
    )
}
