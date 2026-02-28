import {
	type TgdCamera,
	type TgdContext,
	TgdEvent,
	TgdPainterLogic,
	tgdCalcDegToRad,
} from "@tolokoban/tgd";
import { isNumber } from "@tolokoban/type-guards";
import { Inputs } from "../inputs";
import { ArkanoidLevels, StateArkanoid } from "../levels";
import { debug } from "./../levels/debug";
import type { PainterBalls } from "../painters/balls";
import type { PainterBonuses } from "../painters/bonuses";
import type { PainterBricks } from "../painters/bricks";
import type { PainterLaser } from "../painters/laser/laser";
import type { PainterPad } from "../painters/pad";
import type { PainterRay } from "../painters/ray";
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
	ray: PainterRay;
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

	constructor(
		context: TgdContext,
		private readonly options: LogicOptions,
	) {
		super((time: number, delay: number) => this.update(time, delay));
		this.levelIndex = checkForTestOverride(options.levelIndex);
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
		const levels = isTestMode() ? StateArkanoid.levels.value : ArkanoidLevels;
		this.bricks.level = levels[this.levelIndex % levels.length];
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
		return StateArkanoid.lifes.value;
	}
	set lifes(value: number) {
		StateArkanoid.lifes.value = value;
	}

	private readonly update = (time: number, delta: number) => {
		this.bonusManager.update(time);

		const { pad, balls, bricks, bonuses, laser, inputs, options } = this;
		inputs.update(time, delta);
		if (inputs.fire || inputs.gamepad.buttonAorB) balls.unstick();
		pad.update(time, delta);
		const stuckBalls = balls.update(time, delta);
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
		const { ray } = options;
		for (const ball of stuckBalls) {
			ray.x = ball.x;
			ray.y = ball.y;
			ray.vx = ball.dx;
			ray.vy = ball.dy;
			ray.paint(time, delta);
		}
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

	const ang = 20;
	const normalAngleDeg = ang * alpha;
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
