import {
	type TgdContext,
	TgdEvent,
	TgdPainter,
	TgdPainterSprites,
	TgdPainterState,
	type TgdSprite,
	TgdTexture2D,
	type WebglImage,
	webglPresetBlend,
} from "@tolokoban/tgd";
import { AtlasDefBalls } from "@/gfx/05/balls";
import type { HitResult } from "../../types";
import { Ball } from "./ball";

export interface PainterBallsOptions {
	atlasImage: WebglImage;
}

export class PainterBalls extends TgdPainter {
	public readonly eventDead = new TgdEvent();

	private readonly painter: TgdPainter;
	private readonly spritesPainter: TgdPainterSprites;
	private readonly texture: TgdTexture2D;
	private balls: Ball[] = [];

	constructor(context: TgdContext, options: PainterBallsOptions) {
		super();
		const texture = new TgdTexture2D(context, {
			load: options.atlasImage,
		});
		this.texture = texture;
		this.spritesPainter = new TgdPainterSprites(context, {
			atlas: [
				AtlasDefBalls.sprites.balls0,
				AtlasDefBalls.sprites.balls1,
				AtlasDefBalls.sprites.balls2,
				AtlasDefBalls.sprites.balls3,
				AtlasDefBalls.sprites.balls4,
				AtlasDefBalls.sprites.balls5,
				AtlasDefBalls.sprites.balls6,
				AtlasDefBalls.sprites.balls7,
				AtlasDefBalls.sprites.balls8,
				AtlasDefBalls.sprites.balls9,
				AtlasDefBalls.sprites.balls10,
				AtlasDefBalls.sprites.balls11,
				AtlasDefBalls.sprites.balls12,
				AtlasDefBalls.sprites.balls13,
				AtlasDefBalls.sprites.balls14,
				AtlasDefBalls.sprites.balls15,
			],
			texture,
			atlasUnit: 2,
		});
		this.painter = new TgdPainterState(context, {
			blend: webglPresetBlend.alpha,
			children: [this.spritesPainter],
		});
	}

	clear() {
		this.spritesPainter.clear();
	}

	add() {
		return this.spritesPainter.add({});
	}

	remove(sprite: TgdSprite) {
		this.spritesPainter.remove(sprite);
	}

	reset() {
		for (const ball of this.balls) ball.delete();
		this.balls.splice(0);
		const ball = new Ball(this.spritesPainter);
		ball.y = -11;
		ball.speed = 10;
		ball.angle = -30;
		this.balls.push(ball);
		ball.eventDead.addListener(this.removeBall);
		ball.stuck = true;
	}

	private readonly removeBall = (ball: Ball) => {
		console.log("removeBall");
		const index = this.balls.indexOf(ball);
		if (index < 0) return;

		this.balls.splice(index, 1);
		ball.delete();
		if (this.balls.length === 0) this.eventDead.dispatch();
	};

	releaseBalls() {
		for (const ball of this.balls) ball.stuck = false;
	}

	peformHitTest(
		hit: (args: {
			x: number;
			y: number;
			dx: number;
			dy: number;
		}) => HitResult | null,
	) {
		for (const ball of this.balls) {
			const result = hit(ball);
			if (result) {
				ball.applyHit(result);
			}
		}
	}

	setPadXY(x: number, y: number) {
		for (const ball of this.balls) {
			ball.setPadXY(x, y);
		}
	}

	delete() {
		this.texture.delete();
		this.spritesPainter.delete();
	}

	paint(time: number, delay: number) {
		this.painter.paint(time, delay);
		this.update(time, delay);
	}

	update(time: number, delay: number) {
		for (const ball of this.balls) {
			ball.update(time, delay);
		}
	}

	debug() {
		console.debug("🐞 [balls@124] this.balls =", this.balls); // @FIXME: Remove this line written on 2026-01-28 at 10:29
	}
}
