import React from "react"

import {
    gameHasMoreThanOneStartingStick,
    useGame,
    usePossibleMoves,
} from "./_/logic"

import Styles from "./page.module.css"

enum Mode {
    SelectFrom = 0,
    SelectTo = 1,
}

export default function PagePlay() {
    const [game1, setGame1, img1] = useGame()
    const [game2, setGame2, img2] = useGame()
    const [mode, setMode] = React.useState(Mode.SelectFrom)
    const moves = usePossibleMoves(game1)
    React.useEffect(() => {
        if (
            mode === Mode.SelectFrom &&
            !gameHasMoreThanOneStartingStick(moves)
        ) {
            setMode(Mode.SelectTo)
        }
    }, [mode, moves])

    console.log("🚀 [page] mode, moves =", mode, moves) // @FIXME: Remove this line written on 2025-09-03 at 14:10
    if (!img1 || !img2) return null

    return (
        <div className={Styles.play}>
            <div
                className={Styles.background}
                style={{ "--custom-url": `url(${img1.currentSrc})` }}
            />
            <div
                className={Styles.background}
                style={{ "--custom-url": `url(${img2.currentSrc})` }}
            />
            <header>{mode === Mode.SelectTo && <></>}</header>
        </div>
    )
}
