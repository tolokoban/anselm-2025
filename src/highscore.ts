const KEY = "anselm-2025/highscore"

export function getHighscore(): number {
    const data = window.localStorage.getItem(KEY)
    const highscore = Number(data)
    return Number.isNaN(highscore) ? 0 : Math.max(0, highscore)
}

export function setHighscore(score: number) {
    window.localStorage.setItem(KEY, `${Math.max(getHighscore(), score)}`)
}
