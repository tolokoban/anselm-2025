import { Engine } from "@/engine/engine"
import styles from "./page.module.css"

export default function Page() {
    const engine = Engine.use()
    console.log("Render", engine)

    return (
        <div className={styles.page}>
            <canvas ref={engine.attach}></canvas>
        </div>
    )
}
