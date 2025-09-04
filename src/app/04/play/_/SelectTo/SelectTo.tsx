import React from "react"

import styles from "./SelectTo.module.css"
import { Game, gameImage, gameToString } from "../logic"

export interface SelectToProps {
    className?: string
    games: Game[]
    onSelectGame(game: Game): void
}

export default function SelectTo({
    className,
    games,
    onSelectGame,
}: SelectToProps) {
    return (
        <div className={join(className, styles.selectTo)}>
            {games.map((game) => (
                <Button
                    key={gameToString(game)}
                    game={game}
                    onClick={() => onSelectGame(game)}
                />
            ))}
        </div>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}

function Button({ game, onClick }: { game: Game; onClick: () => void }) {
    const [src, setSrc] = React.useState<string | null>(null)
    React.useEffect(() => {
        setSrc(null)
        gameImage(game).then((img) => setSrc(img.currentSrc))
    }, [game])
    return (
        <button
            type="button"
            style={{
                backgroundImage: `url(${src})`,
                opacity: src ? 1 : 0,
            }}
            onClick={onClick}
        />
    )
}
