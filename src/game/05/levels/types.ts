export enum EnumBonusType {
    None = 0,
    TripleBall,
    StickyPad,
    BurningBall,
    LargePad,
    SmallPad,
}

export type BrickOption = Partial<{
    bonus: EnumBonusType
}>

export interface ArkanoidLevel {
    pose: string[]
    options?: Record<string, BrickOption>
}
