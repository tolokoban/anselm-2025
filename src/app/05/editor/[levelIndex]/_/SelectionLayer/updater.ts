import { TgdEvent } from "@tolokoban/tgd"
import React, { useMemo } from "react"
import { useArkanoidLevels } from "@/game/05/levels"
import type { ArkanoidLevel } from "@/game/05/levels/types"
import { EnumBrickType } from "@/game/05/logic/bricks/brick"
import { useEventValue } from "@/utils/event"
import type { AreaSelection } from "./types"
import { LevelUndoManager } from "./undo"

export class LevelUpdater {
    public readonly eventChange = new TgdEvent<ArkanoidLevel>()

    private readonly manager = new LevelUndoManager(this.eventChange, {
        pose: [],
        backgroundIndex: 0,
    })

    get level() {
        return this.manager.level
    }

    reset(level: ArkanoidLevel) {
        this.manager.reset(level)
    }

    clear(selection: AreaSelection) {
        const level = structuredClone(this.manager.level)
        for (let row = selection.row1; row <= selection.row2; row++) {
            const line = level.pose[row]
            if (!line) continue

            level.pose[row] =
                line.slice(0, selection.col1) +
                " ".repeat(selection.col2 - selection.col1 + 2) +
                line.slice(selection.col2 + 2)
        }
        console.log(level)
        this.manager.update(level)
    }

    fill(selection: AreaSelection, type: "[" | "(" | "{" | "<") {
        const level = structuredClone(this.manager.level)
        for (let row = selection.row1; row <= selection.row2; row++) {
            for (let col = selection.col1; col < selection.col2 + 1; col += 2) {
                set(level, col, row, type)
            }
        }
        this.manager.update(level)
    }
}

function set(level: ArkanoidLevel, col: number, row: number, char: string) {
    const FULL_LINE = " ".repeat(26)
    while (level.pose.length <= row) level.pose.push(FULL_LINE)
    const chars = level.pose[row].split("")
    chars[col] = char
    level.pose[row] = chars.join("")
}

export function useLevelUpdater(levelIndex: number) {
    const { levels, updateLevel } = useArkanoidLevels()
    const ref = React.useRef<LevelUpdater | null>(null)
    if (!ref.current) ref.current = new LevelUpdater()
    React.useMemo(() => {
        const level = levels[levelIndex]
        ref.current?.reset(level)
    }, [levelIndex])
    const level = useEventValue(levels[levelIndex], ref.current.eventChange)
    React.useMemo(() => {
        updateLevel(levelIndex, level)
    }, [level, levelIndex])
    return {
        level,
        updater: ref.current,
    }
}
