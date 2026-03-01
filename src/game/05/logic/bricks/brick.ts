import type { TgdSpriteHue } from "@tolokoban/tgd"

import type { BrickOption } from "../../levels/types"

export enum EnumBrickType {
    Normal1,
    Normal2,
    Glass,
    GlassBroken,
    GlassAlmostDead,
    Unbreakable,
}
export interface LogicBrickOptions extends BrickOption {
    index: number
    x: number
    y: number
    hueShift: number
}

export class LogicBrick {
    public dead = false

    constructor(
        public readonly sprite: TgdSpriteHue,
        private readonly options: LogicBrickOptions,
        public readonly col: number,
        public readonly row: number,
    ) {
        sprite.index = options.index
        sprite.x = options.x
        sprite.y = options.y
        sprite.hue = options.hueShift
    }

    get x() {
        return this.sprite.x
    }

    get left() {
        return this.x - 1
    }

    get right() {
        return this.x + 1
    }

    get y() {
        return this.sprite.y
    }

    get bottom() {
        return this.y - 0.5
    }

    get top() {
        return this.y + 0.5
    }

    get index() {
        return this.sprite.index as EnumBrickType
    }
    set index(v: EnumBrickType) {
        this.sprite.index = v
    }

    get bonus() {
        return this.options.bonus
    }
}
