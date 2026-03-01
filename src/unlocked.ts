import { RoutePath } from "./app"
import { GameStorage } from "./storage"

export const Unlocked = {
    get ep02() {
        return GameStorage.ep01.total >= 30
    },
    get ep06() {
        return GameStorage.ep05.victories > 0
    },

    episode(episode: RoutePath) {
        const pieces = episode.split("/")[1]
        switch (pieces) {
            case "01":
                return true
            case "02":
                return this.ep02
            case "03":
                return true
            case "04":
                return true
            case "05":
                return true
            case "06":
                return this.ep06
            case "07":
                return true
            case "08":
                return true
            case "09":
                return true
            default:
                return false
        }
    },
}
