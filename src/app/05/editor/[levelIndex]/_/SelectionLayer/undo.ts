import type { TgdEvent } from "@tolokoban/tgd"
import type { ArkanoidLevel } from "@/game/05/levels/types"

export class LevelUndoManager {
    private readonly undoStack: ArkanoidLevel[] = []
    private _level: ArkanoidLevel

    constructor(
        private readonly eventChange: TgdEvent<ArkanoidLevel>,
        level: ArkanoidLevel
    ) {
        this._level = level
    }

    get level(): ArkanoidLevel {
        return this._level
    }

    reset(level: ArkanoidLevel) {
        this._level = level
        this.undoStack.length = 0
        this.eventChange.dispatch(level)
        return level
    }

    undo() {
        const level = this.undoStack.pop()
        if (!level) return

        this._level = level
        this.eventChange.dispatch(level)
        return level
    }

    update(level: ArkanoidLevel) {
        this.undoStack.push(this._level)
        this._level = level
        this.eventChange.dispatch(level)
        return level
    }
}
