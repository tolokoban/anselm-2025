import {
	IconBack,
	IconPlay,
	Theme,
	ViewButton,
	ViewSlider,
} from "@tolokoban/ui";
import React from "react";
import { useTranslator } from "@/app/06/_translation";
import { useRouteParamAsInt } from "@/app/routes";
import LevelPreview05 from "@/components/05/LevelPreview05";
import { getBackgroundURL } from "@/game/05/background";
import { useArkanoidLevels } from "@/game/05/levels";
import { classNames } from "@/utils/class-names";
import SelectionLayer from "./_/SelectionLayer";
import HueSelector from "./_/SelectionLayer/HueSelector";
import { useKeyboard } from "./_/SelectionLayer/keyboard";
import { useSelectionViewer } from "./_/SelectionLayer/viewer";
import styles from "./page.module.css";

Theme.apply({});

export default function Page05() {
	const tr = useTranslator();
	const levelIndex = useRouteParamAsInt("levelIndex");
	const { levels } = useArkanoidLevels();
	const level = levels[levelIndex];
	const viewer = useSelectionViewer(levelIndex);
	const [hueShiftLevel, setHueShiftLevel] = React.useState(level.hueShift ?? 0);
	const [hueRandomLevel, setHueRandomLevel] = React.useState(
		level.hueRandom ?? 0,
	);
	React.useEffect(() => {
		viewer.hueShift = hueShiftLevel;
		viewer.hueRandom = hueRandomLevel;
	}, [hueShiftLevel, hueRandomLevel, viewer]);
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
		"S-0": () => viewer.setBonus(-1),
		"S-1": () => viewer.setBonus(0),
		"S-2": () => viewer.setBonus(1),
		"S-3": () => viewer.setBonus(2),
		"S-4": () => viewer.setBonus(3),
		"S-5": () => viewer.setBonus(4),
		"S-6": () => viewer.setBonus(5),
		"S-7": () => viewer.setBonus(6),
		"S-8": () => viewer.setBonus(7),
		z: viewer.undo,
	});

	return (
		<div className={styles.page}>
			<div className={styles.preview}>
				<LevelPreview05 level={level} />
				<SelectionLayer viewer={viewer} />
			</div>
			<nav>
				<header>
					<ViewButton icon={IconBack} onClick="#/05/editor">
						Back
					</ViewButton>
					<h1>Level {levelIndex}</h1>
					<ViewButton icon={IconPlay} onClick={`?level=${levelIndex}#/05/play`}>
						Test
					</ViewButton>
				</header>
				<HueSelector
					hueShift={hueShift}
					hueRandom={hueRandom}
					onHueShiftChange={setHueShift}
					onHueRandomChange={setHueRandom}
					hueShiftLevel={hueShiftLevel}
					hueRandomLevel={hueRandomLevel}
					onHueShiftLevelChange={setHueShiftLevel}
					onHueRandomLevelChange={setHueRandomLevel}
				/>
				<fieldset>
					<legend>Background</legend>
					<div className={styles.backgrounds}>
						{[0, 1, 2, 3, 4].map((backgroundIndex) => (
							<button
								key={backgroundIndex}
								className={classNames(
									styles.backgroundButton,
									backgroundIndex === level.backgroundIndex && styles.active,
								)}
								style={{
									backgroundImage: `url(${getBackgroundURL(backgroundIndex)})`,
									filter: `hue-rotate(${level.backgroundHueShift ?? 0}deg)`,
								}}
								onClick={() => {
									viewer.backgroundIndex = backgroundIndex;
								}}
								type="button"
							/>
						))}
					</div>
					{/* <ViewSlider
						min={0}
						max={360}
						step={1}
						value={level.backgroundHueShift ?? 0}
						onChange={(backgroundHueShift) => {
							viewer.update({ backgroundHueShift });
						}}
					/>
					<ViewSlider
						min={1}
						max={13}
						step={1}
						value={level.backgroundRepeats ?? 3}
						onChange={(backgroundRepeats) => {
							viewer.update({ backgroundRepeats });
						}}
					/> */}
				</fieldset>
				<p>{tr.help1()}</p>
			</nav>
		</div>
	);
}
