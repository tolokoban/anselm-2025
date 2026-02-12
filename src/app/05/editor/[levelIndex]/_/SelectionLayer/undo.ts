import type { ArkanoidLevel } from "@/game/05/levels/types"

export class LevelUndoManager {
    private readonly undoStack: ArkanoidLevel[] = []
    private _level: ArkanoidLevel

    constructor(level: ArkanoidLevel) {
        this._level = level
    }

    get level(): ArkanoidLevel {
        return this._level
    }

    reset(level: ArkanoidLevel) {
        this._level = level
        this.undoStack.length = 0
        return level
    }

    undo() {
        const level = this.undoStack.pop()
        if (!level) return

        this._level = level
        return level
    }

    update(level: ArkanoidLevel) {
        this.undoStack.push(this._level)
        this._level = level
        return level
    }
}
