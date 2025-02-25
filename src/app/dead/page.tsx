import React from "react"

import Styles from "./page.module.css"

export default function PageDead() {
    return (
        <div className={Styles.dead}>
            dead
            <hr />
            <a href="#/play">Retente ta chance !</a>
        </div>
    )
}
