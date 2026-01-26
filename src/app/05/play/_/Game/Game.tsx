import { TgdDataGlb, type WebglImage } from "@tolokoban/tgd";
import React from "react";

import { useGame } from "@/game/05/game";

import styles from "./Game.module.css";

export interface GameProps {
	className?: string;
	assets: {
		atlasBricks: WebglImage;
		atlasBalls: WebglImage;
		atlasPads: WebglImage;
	};
}

export default function Game({ className, assets }: GameProps) {
	const game = useGame();

	return (
		<div className={join(className, styles.game)}>
			<canvas ref={(canvas) => game.init(canvas, assets)}></canvas>
			<div className={styles.left}></div>
			<div className={styles.right}></div>
		</div>
	);
}

function join(...classes: unknown[]): string {
	return classes.filter((cls) => typeof cls === "string").join(" ");
}
