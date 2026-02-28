import { tgdCalcClamp, tgdCalcMapRange } from "@tolokoban/tgd";
import type { Inputs } from "../inputs";
import type { PainterPad } from "../painters/pad";

export class LogicPad {
	static readonly speed = 16;

	public speed = LogicPad.speed;

	constructor(
		private readonly inputs: Inputs,
		private readonly pad: PainterPad,
	) {}

	reset() {
		const { pad } = this;
		pad.x = 0;
		pad.y = -12;
		pad.scale = 1;
	}

	update(_time: number, delay: number) {
		const { inputs } = this;
		const speed = this.speed * delay;
		if (inputs.right) {
			this.x += speed;
			return;
		}
		if (inputs.left) {
			this.x -= speed;
			return;
		}
		if (Math.abs(inputs.gamepad.stickV1) > 0) {
			this.x += speed * inputs.gamepad.stickV1;
			return;
		}
		if (inputs.pointerIsMoving) {
			const targetX = tgdCalcMapRange(inputs.pointerX, -1, +1, -13, +13, true);
			if (Math.abs(targetX) < 12.5) {
				if (targetX > this.x) {
					// Go right!
					this.x = Math.min(targetX, this.x + speed);
				} else {
					// Go left!
					this.x = Math.max(targetX, this.x - speed);
				}
			}
		}
	}

	get x() {
		return this.pad.x;
	}
	set x(value: number) {
		const { pad } = this;
		const size = 2 * pad.scale;
		pad.x = tgdCalcClamp(value, -13 + size, 13 - size);
	}

	get y() {
		return this.pad.y;
	}

	get scale() {
		return this.pad.scale;
	}
	set scale(v: number) {
		this.pad.scale = v;
	}
}
