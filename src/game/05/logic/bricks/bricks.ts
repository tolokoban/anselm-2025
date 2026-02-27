import { TgdEvent } from "@tolokoban/tgd";
import type { ArkanoidLevel, EnumBonusType } from "../../levels/types";
import type { PainterBricks } from "../../painters/bricks";
import { EnumBrickType, type LogicBrick } from "./brick";
import { parseLevel } from "./parse-level";

const NORMAL_UP = 0;
const NORMAL_DOWN = Math.PI;
const NORMAL_LEFT = +Math.PI / 2;
const NORMAL_RIGHT = -Math.PI / 2;

export class LogicBricks {
	public readonly eventVictory = new TgdEvent();
	public readonly eventBonus = new TgdEvent<{
		type: EnumBonusType;
		x: number;
		y: number;
	}>();

	private _level: ArkanoidLevel | null = null;
	private _count = 0;
	private bricks: LogicBrick[][] = [];

	constructor(private readonly painter: PainterBricks) {}

	get level() {
		return this._level;
	}
	set level(value: ArkanoidLevel | null) {
		this._level = value;
		this.clear();
		if (!value) return;

		const { bricks, count } = parseLevel(value, this.painter.add);
		this.bricks = bricks;
		this._count = count;
	}

	forEachBrick(callback: (brick: LogicBrick) => void) {
		const set = new Set<LogicBrick>();
		for (const row of this.bricks) {
			for (const brick of row) {
				if (set.has(brick)) continue;

				if (brick) {
					callback(brick);
					set.add(brick);
				}
			}
		}
	}

	clear() {
		this.painter.clear();
	}

	get count() {
		return this._count;
	}
	private set count(v: number) {
		this._count = v;
		if (v === 0) this.eventVictory.dispatch();
	}

	readonly hitTest = (args: {
		x: number;
		y: number;
		dx: number;
		dy: number;
	}): { normalAngle: number; brick: LogicBrick } | null => {
		const ballRadius = 0.1;
		const { x, y, dx, dy } = args;
		const x0 = x - dx;
		const y0 = y - dy;
		const [col0, row0] = this.toColRow(x0, y0);
		const brick0 = this.getBrick(col0, row0);
		const [col1, row1] = this.toColRow(x, y);
		if (col0 === col1 && row0 === row1) return null;

		const posH = this.toX(col0) + (dx > 0 ? 1 : 0);
		const disH = Math.abs(x0 - posH) - ballRadius;
		const timH = disH / Math.abs(dx);
		const posV = this.toY(row0) + (dy > 0 ? 0 : -1);
		const disV = Math.abs(y0 - posV) - ballRadius;
		const timV = disV / Math.abs(dy);
		const tim = Math.min(timH, timV);
		const candidates: Array<{
			normalAngle: number;
			col: number;
			row: number;
			tim: number;
		}> = [];
		if (tim === timH) {
			candidates.push({
				normalAngle: dx > 0 ? NORMAL_LEFT : NORMAL_RIGHT,
				col: col0 + (dx > 0 ? +1 : -1),
				row: row0,
				tim: timH,
			});
			if (timV <= 1) {
				candidates.push({
					normalAngle: dy > 0 ? NORMAL_DOWN : NORMAL_UP,
					col: col0,
					row: row0 + (dy > 0 ? -1 : +1),
					tim: timV,
				});
			}
		} else {
			candidates.push({
				normalAngle: dy > 0 ? NORMAL_DOWN : NORMAL_UP,
				col: col0,
				row: row0 + (dy > 0 ? -1 : +1),
				tim: timV,
			});
			if (timH <= 1) {
				candidates.push({
					normalAngle: dx > 0 ? NORMAL_LEFT : NORMAL_RIGHT,
					col: col0 + (dx > 0 ? +1 : -1),
					row: row0,
					tim: timH,
				});
			}
		}
		for (const candidate of candidates) {
			const brick = this.getBrick(candidate.col, candidate.row);
			if (!brick || brick === brick0) continue;

			args.x = x0 + candidate.tim * dx;
			args.y = y0 + candidate.tim * dy;
			this.bumpBick(brick);
			return {
				brick,
				normalAngle: candidate.normalAngle,
			};
		}
		return null;
	};

	private bumpBick(brick: LogicBrick) {
		if (
			[EnumBrickType.Glass, EnumBrickType.GlassBroken].includes(brick.index)
		) {
			brick.index++;
		} else if (brick.index !== EnumBrickType.Unbreakable) {
			brick.dead = true;
			if (brick.bonus) {
				this.eventBonus.dispatch({
					type: brick.bonus,
					x: brick.x,
					y: brick.y,
				});
			}
			this.painter.remove(brick.sprite);
			this.count--;
		}
	}

	private toX(col: number) {
		return col - 13;
	}

	private toY(row: number) {
		return 13 - row;
	}

	private toCol(x: number) {
		return Math.floor(x + 13);
	}

	private toRow(y: number) {
		return Math.floor(13 - y);
	}

	private toColRow(x: number, y: number): [col: number, row: number] {
		return [this.toCol(x), this.toRow(y)];
	}

	private getBrick(col: number, row: number): LogicBrick | null {
		const bricks = this.bricks[row];
		if (!bricks) return null;

		const brick = bricks[col];
		if (!brick) return null;

		return brick.dead ? null : brick;
	}
}
