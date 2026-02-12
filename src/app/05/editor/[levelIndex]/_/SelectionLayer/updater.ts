import React from "react"
import { useArkanoidLevels } from "@/game/05/levels"

class LevelUpdater {}

export function useLevelUpdater(levelIndex: number) {
    const { levels } = useArkanoidLevels()
    // const [level, setLevel] = React.useState(levels[levelIndex])
    //     const ref = React.useRef<LevelUpdater | null>(null)
    //     if (!ref.current) ref.current = new LevelUpdater(setLevel)

    //     React.useMemo(() => {
    //         const l =  levels[levelIndex]
    //         ref.current.
    //         return l
    //     }, [levels, levelIndex])
}
