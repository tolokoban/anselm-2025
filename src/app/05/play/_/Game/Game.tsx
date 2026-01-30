import { useTranslator } from "@/app/05/_translation";
import { useGame } from "@/game/05/game";
import type { Assets } from "@/game/05/types";
import styles from "./Game.module.css";

export interface GameProps {
	className?: string;
	assets: Assets;
}

export default function Game({ className, assets }: GameProps) {
	const tr = useTranslator();
	const game = useGame();

	return (
		<div className={join(className, styles.game)}>
			<canvas ref={(canvas) => game.init(canvas, assets)}></canvas>
			<div>
				<header>
					<div>{tr.lifes()}</div>
					<div>
						<div className={styles.life} id="life-3" />
						<div className={styles.life} id="life-2" />
						<div className={styles.life} id="life-1" />
					</div>
				</header>
				<main></main>
				<footer>
					<button id="btn-fire" type="button">
						Fire
					</button>
					<button id="btn-left" type="button">
						&lt;
					</button>
					<button id="btn-right" type="button">
						&gt;
					</button>
				</footer>
			</div>
		</div>
	);
}

function join(...classes: unknown[]): string {
	return classes.filter((cls) => typeof cls === "string").join(" ");
}
