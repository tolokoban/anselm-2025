import React from "react"

export type Game = Readonly<[left: number[], center: number[], right: number[]]>

export const INITIAL_GAME: Game = [[1, 2, 3, 4], [], []]

/**
 * @param game The current game.
 * @param from Index of the starting stick (0 to 2).
 * @param to Index of the target stick (0 to 2).
 * @returns `null` if the move is not allowed. Otherwise, return a new game.
 */
export function gameMove(game: Game, from: number, to: number): Game | null {
    const nextGame = structuredClone(game)
    if (from === to) return nextGame

    const disk = nextGame[from].pop()
    if (!disk) return null

    const target = nextGame[to][nextGame[to].length - 1] ?? 0
    if (target >= disk) return null

    nextGame[to].push(disk)
    return nextGame
}

export function gameIsVictory(game: Game) {
    return game[2].length === 4
}

export function gameToString(game: Game) {
    return game.map((s) => s.join("")).join("-")
}

const cache = new Map<string, Promise<HTMLImageElement>>()

export function gameImage(game: Game): Promise<HTMLImageElement> {
    const name = gameToString(game)
    const fromCache = cache.get(name)
    if (fromCache) return fromCache

    const promise = new Promise<HTMLImageElement>((resolve) => {
        const img = new Image()
        const base = "assets/04/images"
        const prefix = `${base}/${name}`
        const big = `${prefix}.webp`
        const small = `${prefix}.small.webp`
        img.srcset = `${big} 1920w, ${small} 960w`
        img.sizes = "(width > 960px) 1920px, (height > 960px) 1920px, 96px"
        img.alt = name
        img.onload = () => {
            resolve(img)
        }
        img.onerror = () => {
            console.error("Unable to load image:", img.srcset)
            resolve(img)
        }
    })
    cache.set(name, promise)
    return promise
}

export function gamePossibleMoves(game: Game): [Game[], Game[], Game[]] {
    const arr = [0, 1, 2]
    return arr.map((from) =>
        arr
            .map((to) => (from === to ? null : gameMove(game, from, to)))
            .filter((g) => !!g)
    ) as [Game[], Game[], Game[]]
}

export function gameHasMoreThanOneStartingStick(
    moves: [Game[], Game[], Game[]]
) {
    const count: number = moves.reduce(
        (acc, items) => acc + (items.length === 0 ? 0 : 1),
        0
    )
    return count > 1
}

export function useGame(): [
    game: Game,
    setGame: (game: Game) => void,
    img: HTMLImageElement | null,
] {
    const [game, setGame] = React.useState(INITIAL_GAME)
    const [img, setImg] = React.useState<HTMLImageElement | null>(null)
    React.useEffect(() => {
        gameImage(game).then(setImg)
    }, [game])
    return [game, setGame, img]
}

export function usePossibleMoves(game: Game): [Game[], Game[], Game[]] {
    const moves = React.useMemo(() => gamePossibleMoves(game), [game])
    React.useEffect(() => {
        // Preload images
        moves.forEach((stick) => stick.forEach(gameImage))
    }, [moves])
    return moves
}
