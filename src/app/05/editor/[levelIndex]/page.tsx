import React from "react";

import { useRouteParamAsInt } from "@/app/routes";
import LevelPreview05 from "@/components/05/LevelPreview05";
import { useArkanoidLevels } from "@/game/05/levels";

import SelectionLayer from "./_/SelectionLayer";
import { useKeyboard } from "./_/SelectionLayer/keyboard";
import { useSelectionViewer } from "./_/SelectionLayer/viewer";
import styles from "./page.module.css";

export default function Page05() {
	const levelIndex = useRouteParamAsInt("levelIndex");
	const { levels } = useArkanoidLevels();
	const level = levels[levelIndex];
	const viewer = useSelectionViewer();
	useKeyboard({
        "+": viewer.growSelection,
        "-": viewer.shrinkSelection,
        "ArrowRight": viewer.moveRight,
        "ArrowLeft": viewer.moveLeft,
        "ArrowUp": viewer.moveUp,
        "ArrowDown": viewer.moveDown,
        "S-ArrowRight": viewer.growRight,
        "S-ArrowLeft": viewer.growLeft,
        "S-ArrowUp": viewer.growUp,
        "S-ArrowDown": viewer.growDown,
        "A-ArrowRight": viewer.shrinkRight,
        "A-ArrowLeft": viewer.shrinkLeft,
        "A-ArrowUp": viewer.shrinkUp,
        "A-ArrowDown": viewer.shrinkDown,
    });

	return (
		<div className={styles.page}>
			<div className={styles.preview}>
				<LevelPreview05 level={level} />
				<SelectionLayer viewer={viewer} />
			</div>
			<nav>
				<h1>Level {levelIndex}</h1>
			</nav>
		</div>
	);
}
