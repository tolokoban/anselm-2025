export enum EnumHitResult {
    Brick = 0,
    Wall,
    Death,
}

export interface HitResult {
    type: EnumHitResult
    normalAngleDeg: number
}

export enum EnumBrick {
    Simple1 = 0,
    Simple2 = 1,
    Glass1 = 2,
    Glass2 = 3,
    Glass3 = 4,
    Unbreakable = 5,
}
