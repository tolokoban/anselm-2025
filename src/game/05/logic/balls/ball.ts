import {
	type TgdSprite,
	tgdCalcClamp,
	tgdCalcDegToRad,
	tgdCalcModulo,
	tgdCalcModuloDiscrete,
	tgdCalcRandom,
} from "@tolokoban/tgd";

export enum EnumBallType {
	Normal,
	Burning,
}

export class LogicBall {
	/** Radians */
	public angle = 0;
	public speed = 12;
	public type = EnumBallType.Normal;

	private _dx = 0;
	private _dy = 0;
	private stuck = true;
	private stickyShift = 0;

	constructor(
		public readonly sprite: TgdSprite,
		private readonly ask: {
			padX(): number;
			padY(): number;
		},
	) {
		this.angle = tgdCalcDegToRad(-30);
	}

	stick() {
		this.stickyShift = this.x - this.ask.padX();
		this.stuck = true;
	}

	unstick() {
		this.stuck = false;
	}

	/**
	 * @param normalAngle Radians
	 * @param clamp If `true`, the resulting angle can only be
	 * between -60 and +60 degrees. Thats's used for the pad.
	 */
	bounce(normalAngle: number, clamp = false) {
		// We randomize a little the bounce to prevent infinite loops.
		const RND = 0.017453292519943295; // 1 degree expressed in radians
		this.angle =
			2 * normalAngle - (this.angle + Math.PI) + tgdCalcRandom(-RND, +RND);
		if (clamp) {
			const ang = tgdCalcDegToRad(60);
			this.angle = tgdCalcClamp(
				tgdCalcModulo(this.angle, -Math.PI, +Math.PI),
				-ang,
				+ang,
			);
		}
	}

	get x() {
		return this.sprite.x;
	}
	set x(v: number) {
		this.sprite.x = v;
	}

	get y() {
		return this.sprite.y;
	}
	set y(v: number) {
		this.sprite.y = v;
	}

	get dx() {
		return this._dx;
	}

	get dy() {
		return this._dy;
	}

	/**
	 * @param delta Seconds
	 */
	update(time: number, delta: number) {
		const { angle, sprite } = this;
		sprite.angle = angle;
		sprite.index =
			tgdCalcModuloDiscrete(time, 0.3, 8) +
			(this.type === EnumBallType.Burning ? 8 : 0);
		if (this.stuck) {
			const { ask } = this;
			const padX = ask.padX();
			const padY = ask.padY();
			this.x = padX + this.stickyShift;
			this.y = padY + 0.66;
		} else {
			const speed = this.speed * delta;
			this._dx = speed * Math.sin(-angle);
			this._dy = speed * Math.cos(-angle);
			const length = this._dx ** 2 + this._dy ** 2;
			if (length > 1) {
				// Between 2 frames, the ball cannot cross more or equal to one unit.
				const scale = 1 / Math.sqrt(length);
				this._dx *= scale;
				this._dy *= scale;
			}
			this.x += this._dx;
			this.y += this._dy;
		}
	}
}
