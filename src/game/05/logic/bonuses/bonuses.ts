import { EnumBonusType } from "../../levels/types"
import type { PainterBonuses } from "../../painters/bonuses"
import { LogicBonus } from "./bonus"

export class LogicBonuses {
    public speed = 5

    private readonly bonuses: LogicBonus[] = []

    constructor(private readonly painter: PainterBonuses) {}

    reset() {
        const { painter, bonuses } = this
        painter.clear()
        bonuses.splice(0)
    }

    add(options: { type: EnumBonusType; x: number; y: number }): void {
        const bonus = new LogicBonus(this.painter.add(), options)
        this.bonuses.push(bonus)
    }

    update(time: number, delta: number) {
        const speed = this.speed * delta
        for (const bonus of [...this.bonuses]) {
            bonus.y -= speed
            if (bonus.y < -15) this.remove(bonus)
        }
    }

    hitTest(
        x: number,
        y: number,
        radiusX: number,
        radiusY: number
    ): EnumBonusType {
        const RX = 1
        const RY = 0.5
        for (const bonus of [...this.bonuses]) {
            if (Math.abs(bonus.y - y) > radiusY + RY) continue
            if (Math.abs(bonus.x - x) > radiusX + RX) continue

            this.remove(bonus)
            return bonus.type
        }
        return EnumBonusType.None
    }

    private remove(bonus: LogicBonus) {
        const { bonuses, painter } = this
        const index = bonuses.indexOf(bonus)
        if (index === -1) return

        painter.remove(bonus.sprite)
        bonuses.splice(index, 1)
    }
}
