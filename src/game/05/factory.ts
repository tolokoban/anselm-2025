import {
	type TgdContext,
	TgdGeometryPlane,
	TgdMaterialFlatTexture,
	type TgdPainter,
	TgdPainterGroup,
	TgdPainterMesh,
	TgdPainterState,
	webglPresetDepth,
} from "@tolokoban/tgd";
import { getBackgroundTexture } from "./background";
import { StateArkanoid } from "./levels";
import type { ArkanoidLevel } from "./levels/types";
import { Logic } from "./logic";
import { PainterBalls } from "./painters/balls";
import { PainterBonuses } from "./painters/bonuses";
import { PainterBricks } from "./painters/bricks";
import { PainterLaser } from "./painters/laser/laser";
import { PainterPad } from "./painters/pad";
import { PainterRay } from "./painters/ray";
import type { Assets } from "./types";

export function makeLevelPainterAndLogic(
	context: TgdContext,
	assets: Assets,
	levelIndex: number,
): {
	painter: TgdPainter;
	logic: Logic;
} {
	const levels: ArkanoidLevel[] = StateArkanoid.levels.value;
	const bricksPainter = new PainterBricks(context, {
		atlasImage: assets.atlasBricks,
	});
	const bonusesPainter = new PainterBonuses(context, {
		atlasImage: assets.atlasBonuses,
	});
	const padPainter = new PainterPad(context, {
		atlasImage: assets.atlasPads,
		atlasImageBloom: assets.atlasPadsBloom,
	});
	const ballsPainter = new PainterBalls(context, {
		atlasImage: assets.atlasBalls,
	});
	const laserPainter = new PainterLaser(context, {
		atlasImage: assets.atlasLasers,
	});
	const rayPainter = new PainterRay(context);
	const level = levels[levelIndex % levels.length];
	const board = new TgdPainterMesh(context, {
		transfo: {
			position: [0, 0, -1e-1],
		},
		geometry: new TgdGeometryPlane({ sizeX: 26, sizeY: 26, uv1: [3, 3] }),
		material: new TgdMaterialFlatTexture({
			texture: getBackgroundTexture(context, level),
		}),
	});
	const painter = new TgdPainterGroup([
		new TgdPainterState(context, {
			depth: webglPresetDepth.lessOrEqual,
			children: [
				board,
				bricksPainter,
				padPainter,
				laserPainter,
				bonusesPainter,
				ballsPainter,
			],
		}),
	]);
	const logic = new Logic(context, {
		camera: context.camera,
		levelIndex,
		balls: ballsPainter,
		bonuses: bonusesPainter,
		bricks: bricksPainter,
		pad: padPainter,
		laser: laserPainter,
		ray: rayPainter,
	});
	return { painter, logic };
}
