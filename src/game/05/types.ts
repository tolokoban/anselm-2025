export enum EnumHitResult {
    Brick = 0,
    Wall,
    Death,
}

export interface HitResult {
    type: EnumHitResult
    normalAngleDeg: number
    /**
     * When the object crosses a line,
     * its coords are put back to the line.
     */
    x: number
    y: number
}

export enum EnumBrick {
    Simple1 = 0,
    Simple2 = 1,
    Glass1 = 2,
    Glass2 = 3,
    Glass3 = 4,
    Unbreakable = 5,
}
