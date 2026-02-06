export enum EnumBonusType {
    None = 0,
    TripleBall,
    StickyPad,
    BurningBall,
    LargePad,
    SmallPad,
    UpsideDown,
    Laser,
}

export type BrickOption = Partial<{
    bonus: EnumBonusType
    hue: number
}>

export interface ArkanoidLevel {
    pose: string[]
    options?: Record<string, BrickOption>
}
