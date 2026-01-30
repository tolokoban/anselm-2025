import type { TgdSprite } from "@tolokoban/tgd"
import type { EnumBonusType } from "../../levels/types"

export class LogicBonus {
    public readonly type: EnumBonusType

    constructor(
        public readonly sprite: TgdSprite,
        options: {
            type: EnumBonusType
            x: number
            y: number
        }
    ) {
        sprite.x = options.x
        sprite.y = options.y
        sprite.index = options.type % 8
        this.type = options.type
    }

    get x() {
        return this.sprite.x
    }

    get y() {
        return this.sprite.y
    }
    set y(v: number) {
        this.sprite.y = v
    }
}
