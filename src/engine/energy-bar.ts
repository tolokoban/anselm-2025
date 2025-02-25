import { clamp } from "@/utils/calc"

const MAX_ENERGY = 10000

export class EnergyBar {
    private _value = MAX_ENERGY

    get value() {
        return this._value
    }

    private set value(value: number) {
        const clampedValue = clamp(value, 0, MAX_ENERGY)
        if (clampedValue === this._value) return

        this._value = clampedValue
        const div = document.getElementById("energy-level")
        if (!div) return

        const percent = (100 * clampedValue) / MAX_ENERGY
        div.style.width = `${percent}%`
    }

    reset() {
        this._value = 0
        this.value = MAX_ENERGY
    }

    add(delta: number) {
        this.value += delta
    }

    sub(delta: number) {
        this.value -= delta
    }
}
