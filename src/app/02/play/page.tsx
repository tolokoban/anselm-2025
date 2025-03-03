import React from "react"

import Styles from "./page.module.css"
import Coin from "./_/Coin"
import Button from "./_/Button"
import { goto, makeGoto } from "@/app/routes"

const coins = "abcdefghijklmnopqr".split("")

export default function PagePlay() {
    const [taken, setTaken] = React.useState(0)
    const [yourTurn, setYourTurn] = React.useState(true)
    const handleTake = (n: number) => {
        setYourTurn(false)
        setTaken(taken + n)
        console.log("You took", n)
        if (taken + n < coins.length) {
            window.setTimeout(
                () => {
                    setTaken((v: number) => {
                        let n = (coins.length - v) % 4
                        if (n === 0) n = 1 + Math.floor(3 * Math.random())
                        const newValue = v + n
                        if (newValue >= coins.length) {
                            window.setTimeout(() => goto("/02/dead"), 1500)
                        }
                        return newValue
                    })
                    setYourTurn(true)
                },
                500 + 1500 * Math.random()
            )
        } else {
            window.setTimeout(makeGoto("/02/win"), 1000)
        }
    }
    return (
        <div className={Styles.play}>
            <main>
                {coins.map((key, index) => (
                    <Coin reversed={index < taken} />
                ))}
            </main>
            <nav>
                <div>
                    {[1, 2, 3].map((n) => (
                        <Button
                            key={`take${n}`}
                            onClick={() => handleTake(n)}
                            disabled={!yourTurn || taken >= coins.length}
                        >
                            {n}
                        </Button>
                    ))}
                </div>
                <Button onClick={makeGoto("/02/help")}>?</Button>
            </nav>
        </div>
    )
}
