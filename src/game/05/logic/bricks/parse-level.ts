import {
	type TgdSpriteHue,
	tgdCalcDegToRad,
	tgdCalcRandom,
} from "@tolokoban/tgd";
import { isNumber } from "@tolokoban/type-guards";
import type { ArkanoidLevel } from "../../levels/types";
import { EnumBrickType, LogicBrick, type LogicBrickOptions } from "./brick";

const INDEXES: Record<string, number> = {
	"[": 0,
	"(": 1,
	"<": 2,
	"{": 5,
};

export function parseLevel(
	level: ArkanoidLevel,
	add: (x: number, y: number) => TgdSpriteHue,
): { bricks: LogicBrick[][]; count: number } {
	const spritesPerRow: LogicBrick[][] = [];
	let count = 0;
	let y = 12.5;
	for (let row = 0; row < 26; row++) {
		let x = -12;
		const currentSprites: LogicBrick[] = [];
		spritesPerRow.push(currentSprites);
		const line = level.pose[row];
		if (!line) continue;

		for (let col = 0; col < 26; col++) {
			if (col >= line.length) break;

			const index = INDEXES[line.charAt(col)];
			if (isNumber(index)) {
				const data: LogicBrickOptions = {
					index,
					x,
					y,
					hueShift: 0,
					...level.options?.[line.charAt(col + 1)],
				};
				data.hueShift +=
					tgdCalcDegToRad(level.hueShift ?? 0) +
					tgdCalcRandom(tgdCalcDegToRad(level.hueRandom ?? 0));
				const brick = new LogicBrick(add(x, y), data, col, row);
				currentSprites[col] = brick;
				currentSprites[col + 1] = brick;
				col++;
				x++;
				if (brick.index !== EnumBrickType.Unbreakable) count++;
			}
			x++;
		}
		y--;
	}
	return { bricks: spritesPerRow, count };
}
