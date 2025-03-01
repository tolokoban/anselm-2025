import { GameStorage } from "./storage"

export const Unlocked = {
    get ep02() {
        return GameStorage.ep01.total >= 30
    },
}
