import AtomicState from "@tolokoban/react-state"
import { debug } from "./debug"
import { intro } from "./intro"
import { laser } from "./laser"
import { pacman } from "./pacman"
import { spaceinvader } from "./spaceinvader"
import { type ArkanoidLevel, isArkanoidLevelArray } from "./types"
import { upsideDown } from "./upside-down"

/**
 * All levels: https://strategywiki.org/wiki/Arkanoid:_Revenge_of_Doh/Walkthrough
 */

export const ArkanoidLevels = [intro, spaceinvader, laser, upsideDown, pacman]

const arkanoidLevelsState = new AtomicState(ArkanoidLevels, {
    storage: {
        id: "05/levels",
        guard: isArkanoidLevelArray,
    },
})

export function useArkanoidLevels() {
    const [levels, setLevels] = arkanoidLevelsState.useState()
    return {
        levels,
        updateLevel(levelIndex: number, level: ArkanoidLevel) {
            const array = levels.slice()
            array[levelIndex] = level
            setLevels(array)
        },
        deleteLevel(levelIndex: number) {
            const array = levels.slice()
            array.splice(levelIndex, 1)
            setLevels(array)
        },
        addLevel(level: ArkanoidLevel) {
            setLevels([...levels, level])
        },
        swapLevels(levelIndex1: number, levelIndex2: number) {
            const level1 = levels[levelIndex1]
            const level2 = levels[levelIndex2]
            const array = levels.slice()
            array[levelIndex1] = level2
            array[levelIndex2] = level1
            setLevels(array)
        },
        resetLevels() {
            setLevels(ArkanoidLevels)
        },
    }
}
