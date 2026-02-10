export enum EnumBonusType {
    None = 0,
    TripleBall,
    StickyPad,
    BurningBall,
    LargePad,
    SmallPad,
    UpsideDown,
    Laser,
    Slow,
}

export type BrickOption = Partial<{
    bonus: EnumBonusType
    hueShift: number
    hueRandom: number
}>

export interface ArkanoidLevel {
    backgroundIndex: number
    backgroundRepeats?: number
    backgroundHueShift?: number
    hueShift?: number
    hueRandom?: number
    pose: string[]
    options?: Record<string, BrickOption>
}
