import { TgdSprite } from "@tolokoban/tgd"

export enum EnumBrickType {
    Normal1,
    Normal2,
    Glass,
    GlassBroken,
    GlassAlmostDead,
    Unbreakable,
}
export interface LogicBrickOptions {
    index: number
    x: number
    y: number
}

export class LogicBrick {
    public dead = false

    constructor(
        public readonly sprite: TgdSprite,
        options: LogicBrickOptions
    ) {
        sprite.index = options.index
        sprite.x = options.x
        sprite.y = options.y
    }

    get x() {
        return this.sprite.x
    }

    get y() {
        return this.sprite.y
    }

    get index() {
        return this.sprite.index as EnumBrickType
    }
    set index(v: EnumBrickType) {
        this.sprite.index = v
    }

    readonly hitTest = (args: {
        x: number
        y: number
        dx: number
        dy: number
    }): number | null => {
        const { x, y, dx, dy } = args
        const x0 = x - this.x
        const y0 = y - this.y
        if (dy > 0) {
            // Ball is going up.
            const hori = crossHori(x0, y0, dx, dy, 0, -0.5)
            if (Math.abs(hori) <= 1) return Math.PI
            else return dx > 0 ? +Math.PI / 2 : -Math.PI / 2
        } else {
            // Ball is going down.
            const hori = crossHori(x0, y0, dx, dy, 0, +0.5)
            if (Math.abs(hori) <= 1) return 0
            else return dx > 0 ? +Math.PI / 2 : -Math.PI / 2
        }
    }
}

/**
 * @return The coefficient of the crossing point on line 2.
 *
 * Let's call this value `alpha`, then the crossing point will
 * be:
 *
 * ```ts
 * x = x2 + alpha * vx2
 * y = y2 + alpha * vy2
 * ```
 *
 * This value can be infinite if the lines do not cross.
 */
function cross(
    x1: number,
    y1: number,
    vx1: number,
    vy1: number,
    x2: number,
    y2: number,
    vx2: number,
    vy2: number
) {
    /**
     * x1 + t1.vx1 = x2 + t2.vx2
     * y1 + t1.vy1 = y2 + t2.vy2
     *
     * x1.vy1 + t1.vx1.vy1 = x2.vy1 + t2.vx2.vy1
     * y1.vx1 + t1.vx1.vy1 = y2.vx1 + t2.vx1.vy2
     *
     * x1.vy1 - y1.vx1 = x2.vy1 - y2.vx1 = t2.(vx2.vy1 - vx1.vy2)
     *
     * t2 = (x2*vy1 - y2*vx1 + y1*vx1 - x1*vy1) / det
     */
    const det = vx1 * vy2 - vy1 * vx2
    if (det === 0) return Infinity

    return (x2 * vy1 - y2 * vx1 + y1 * vx1 - x1 * vy1) / det
}

function crossHori(
    x1: number,
    y1: number,
    vx1: number,
    vy1: number,
    x2: number,
    y2: number
) {
    return cross(x1, y1, vx1, vy1, x2, y2, 1, 0)
}

function crossVert(
    x1: number,
    y1: number,
    vx1: number,
    vy1: number,
    x2: number,
    y2: number
) {
    return cross(x1, y1, vx1, vy1, x2, y2, 0, 1)
}
