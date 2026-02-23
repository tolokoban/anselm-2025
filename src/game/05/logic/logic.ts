import {
	type TgdCamera,
	type TgdContext,
	TgdEvent,
	TgdPainterLogic,
	tgdCalcClamp,
	tgdCalcDegToRad,
	tgdCalcModulo,
} from "@tolokoban/tgd";
import { isNumber } from "@tolokoban/type-guards";
import { byId } from "@/utils/dom";
import { Inputs } from "../inputs";
import { ArkanoidLevels } from "../levels";
import type { PainterBalls } from "../painters/balls";
import type { PainterBonuses } from "../painters/bonuses";
import type { PainterBricks } from "../painters/bricks";
import type { PainterLaser } from "../painters/laser/laser";
import type { PainterPad } from "../painters/pad";
import { EnumBallType, type LogicBall } from "./balls/ball";
import { LogicBalls } from "./balls/balls";
import { BonusManager } from "./bonus-manager";
import { LogicBonuses } from "./bonuses/bonuses";
import { LogicBricks } from "./bricks";
import { EnumBrickType } from "./bricks/brick";
import { LogicLaser } from "./laser";
import { LogicPad } from "./pad";

export interface LogicOptions {
	camera: TgdCamera;
	levelIndex: number;
	balls: PainterBalls;
	bricks: PainterBricks;
	bonuses: PainterBonuses;
	pad: PainterPad;
	laser: PainterLaser;
}

export class Logic extends TgdPainterLogic {
	public readonly levelIndex: number;
	public readonly eventVictory = new TgdEvent();
	public readonly eventGameOver = new TgdEvent();

	private readonly pad: LogicPad;
	private readonly balls: LogicBalls;
	private readonly bricks: LogicBricks;
	private readonly bonuses: LogicBonuses;
	private readonly laser: LogicLaser;
	private readonly inputs: Inputs;
	private bonusManager: BonusManager;

	private _lifes = 3;

	constructor(context: TgdContext, options: LogicOptions) {
		super((time: number, delay: number) => this.update(time, delay));
		this.levelIndex = checkForTestOverride(options.levelIndex);
		this.lifes = 3;
		const inputs = new Inputs(context);
		this.inputs = inputs;
		this.pad = new LogicPad(inputs, options.pad);
		this.balls = new LogicBalls(options.balls, {
			padX: () => this.pad.x,
			padY: () => this.pad.y,
		});
		this.balls.eventDead.addListener(() => {
			this.lifes--;
			if (this.lifes <= 0) {
				this.eventGameOver.dispatch();
				return;
			}
			this.pad.reset();
			this.balls.reset();
			this.bonuses.reset();
			this.laser.enabled = false;
		});
		this.balls.reset();
		this.bonuses = new LogicBonuses(options.bonuses);
		this.bricks = new LogicBricks(options.bricks);
		this.bricks.eventVictory.addListener(this.handleLevelVictory);
		this.bricks.eventBonus.addListener((bonus) => this.bonuses.add(bonus));
		this.bricks.level = ArkanoidLevels[this.levelIndex % ArkanoidLevels.length];
		this.laser = new LogicLaser(this.pad, options.laser);
		this.bonusManager = new BonusManager({
			context,
			camera: context.camera,
			pad: this.pad,
			balls: this.balls,
			bonuses: this.bonuses,
			laser: this.laser,
		});
		context.inputs.keyboard.eventKeyPress.addListener((evt) => {
			evt.preventDefault();
			evt.stopPropagation();
			if (evt.key === "N") this.handleLevelVictory();
		});
	}

	get lifes() {
		return this._lifes;
	}
	set lifes(value: number) {
		this._lifes = value;
		for (const i of [1, 2, 3]) {
			const elem = byId(`life-${i}`);
			elem.style.opacity = i > value ? "0" : "1";
		}
	}

	private readonly update = (time: number, delta: number) => {
		this.bonusManager.update(time);

		const { pad, balls, bricks, bonuses, laser, inputs } = this;
		inputs.update(time, delta);
		if (inputs.fire || inputs.gamepad.buttonAorB) balls.unstick();
		pad.update(time, delta);
		balls.update(time, delta);
		for (const ball of balls.list()) {
			const anglePad = collideWithPad(ball, pad);
			if (isNumber(anglePad)) {
				ball.bounce(anglePad, true);
				if (this.bonusManager.stickyPad) ball.stick();
			} else {
				const hit = bricks.hitTest(ball);
				if (hit) {
					const { normalAngle, brick } = hit;
					if (
						brick.index === EnumBrickType.Unbreakable ||
						ball.type === EnumBallType.Normal
					) {
						ball.bounce(normalAngle);
					}
				}
			}
		}
		bonuses.update(time, delta);
		laser.update(time, delta);
		laser.hitTest(bricks);
	};

	private handleLevelVictory = () => {
		if (isTestMode()) {
			globalThis.location.hash = "#/05/edit";
		} else {
			this.eventVictory.dispatch();
		}
	};
}

function collideWithPad(ball: LogicBall, pad: LogicPad): number | null {
	const { x, y, dy } = ball;
	if (dy >= 0 || Math.abs(y - pad.y) > 0.5) return null;

	const dist = x - pad.x;
	const alpha = dist / (2 * pad.scale);
	if (Math.abs(alpha) > 1) return null;

	const ang = 30;
	const normalAngleDeg = ang * alpha ** 3;
	return tgdCalcDegToRad(-normalAngleDeg);
}

function checkForTestOverride(levelIndex: number): number {
	const params = new URLSearchParams(globalThis.location.search);
	const index = parseInt(params.get("level") ?? "NaN", 10);
	if (Number.isNaN(index)) return levelIndex;
	return index;
}

function isTestMode(): boolean {
	const params = new URLSearchParams(globalThis.location.search);
	const index = parseInt(params.get("level") ?? "NaN", 10);
	return !Number.isNaN(index);
}
