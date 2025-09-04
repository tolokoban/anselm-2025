import React from "react"

import { gameIsVictory, useGame, usePossibleMoves } from "./_/logic"

import Styles from "./page.module.css"
import SelectTo from "./_/SelectTo"
import Victory from "./_/Victory"
import Spinner from "@/components/Spinner"
import Scene from "./_/Scene"

enum Mode {
    SelectFrom = 0,
    SelectTo = 1,
}

export default function PagePlay() {
    /** Current game. */
    const [game1, setGame1, img1] = useGame()
    /** Previous game. Used for transitions. */
    const [game2, setGame2, img2] = useGame()
    const moves = usePossibleMoves(game1)
    const [loaded, setLoaded] = React.useState(false)
    React.useEffect(() => {}, [game1])

    if (!img1 || !img2) return <Spinner />

    return (
        <div className={Styles.play}>
            <Scene img1={img1} img2={img2} />
            {!gameIsVictory(game1) && (
                <header>
                    <SelectTo
                        games={[...moves[0], ...moves[1], ...moves[2]]}
                        onSelectGame={(g) => {
                            setGame2(game1)
                            setGame1(g)
                        }}
                    />
                </header>
            )}
            <Victory game={game1} />
        </div>
    )
}
