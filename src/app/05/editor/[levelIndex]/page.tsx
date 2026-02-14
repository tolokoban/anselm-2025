import React from "react";

import { useRouteParamAsInt } from "@/app/routes";
import LevelPreview05 from "@/components/05/LevelPreview05";
import { useArkanoidLevels } from "@/game/05/levels";
import { classNames } from "@/utils/class-names";
import SelectionLayer from "./_/SelectionLayer";
import HueSelector from "./_/SelectionLayer/HueSelector";
import { useKeyboard } from "./_/SelectionLayer/keyboard";
import { useSelectionViewer } from "./_/SelectionLayer/viewer";
import styles from "./page.module.css";

export default function Page05() {
	const levelIndex = useRouteParamAsInt("levelIndex");
	const { levels } = useArkanoidLevels();
	const level = levels[levelIndex];
	const viewer = useSelectionViewer(levelIndex);
	const [hueShift, setHueShift] = React.useState(0);
	const [hueRandom, setHueRandom] = React.useState(0);
	useKeyboard({
		"+": viewer.growSelection,
		"-": viewer.shrinkSelection,
		ArrowRight: viewer.moveRight,
		ArrowLeft: viewer.moveLeft,
		ArrowUp: viewer.moveUp,
		ArrowDown: viewer.moveDown,
		"S-ArrowRight": viewer.growRight,
		"S-ArrowLeft": viewer.growLeft,
		"S-ArrowUp": viewer.growUp,
		"S-ArrowDown": viewer.growDown,
		"A-ArrowRight": viewer.shrinkRight,
		"A-ArrowLeft": viewer.shrinkLeft,
		"A-ArrowUp": viewer.shrinkUp,
		"A-ArrowDown": viewer.shrinkDown,
		Delete: viewer.clearRegion,
		"1": () => viewer.fillRegion("["),
		"2": () => viewer.fillRegion("("),
		"3": () => viewer.fillRegion("<"),
		"4": () => viewer.fillRegion("{"),
	});

	return (
		<div className={styles.page}>
			<div className={styles.preview}>
				<LevelPreview05 level={level} />
				<SelectionLayer viewer={viewer} />
			</div>
			<nav>
				<h1>Level {levelIndex}</h1>
				<HueSelector hueShift={hueShift} hueRandom={hueRandom} onHueShiftChange={setHueShift} onHueRandomChange={setHueRandom}/>
			</nav>
		</div>
	);
}
