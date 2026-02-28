import type { TgdSpriteHue } from "@tolokoban/tgd";
import type { BrickOption } from "../../levels/types";

export enum EnumBrickType {
	Normal1,
	Normal2,
	Glass,
	GlassBroken,
	GlassAlmostDead,
	Unbreakable,
}
export interface LogicBrickOptions extends BrickOption {
	index: number;
	x: number;
	y: number;
	hueShift: number;
}

export class LogicBrick {
	public dead = false;

	constructor(
		public readonly sprite: TgdSpriteHue,
		private readonly options: LogicBrickOptions,
		public readonly col: number,
		public readonly row: number,
	) {
		sprite.index = options.index;
		sprite.x = options.x;
		sprite.y = options.y;
		sprite.hue = options.hueShift;
	}

	get x() {
		return this.sprite.x;
	}

	get y() {
		return this.sprite.y;
	}

	get index() {
		return this.sprite.index as EnumBrickType;
	}
	set index(v: EnumBrickType) {
		this.sprite.index = v;
	}

	get bonus() {
		return this.options.bonus;
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
	vy2: number,
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
	const det = vx1 * vy2 - vy1 * vx2;
	if (det === 0) return Infinity;

	return (x2 * vy1 - y2 * vx1 + y1 * vx1 - x1 * vy1) / det;
}

function crossHori(
	x1: number,
	y1: number,
	vx1: number,
	vy1: number,
	x2: number,
	y2: number,
) {
	return cross(x1, y1, vx1, vy1, x2, y2, 1, 0);
}

function crossVert(
	x1: number,
	y1: number,
	vx1: number,
	vy1: number,
	x2: number,
	y2: number,
) {
	return cross(x1, y1, vx1, vy1, x2, y2, 0, 1);
}
