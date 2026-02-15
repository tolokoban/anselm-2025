/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { tgdCalcRandom } from "@tolokoban/tgd";
import React from "react";
import styles from "./HueSelector.module.css";

export interface HueSelectorProps {
	className?: string;
	hueShift: number;
	hueRandom: number;
	onHueShiftChange: (hueShift: number) => void;
	onHueRandomChange: (hueRandom: number) => void;
	hueShiftLevel: number;
	hueRandomLevel: number;
	onHueShiftLevelChange: (hueShiftLevel: number) => void;
	onHueRandomLevelChange: (hueRandomLevel: number) => void;
}

export default function HueSelector({
	className,
	hueShift,
	hueRandom,
	onHueShiftChange,
	onHueRandomChange,
	hueShiftLevel,
	hueRandomLevel,
	onHueShiftLevelChange,
	onHueRandomLevelChange,
}: HueSelectorProps) {
	return (<>
        <fieldset><legend>Bricks</legend>
		<div className={join(className, styles.hueSelector)}>
			<Slider value={hueShift} onChange={onHueShiftChange} />
			<Slider value={hueRandom} onChange={onHueRandomChange} />
			<div className={styles.grid}>
				{"abcdefghijkl".split("").map((c, index) => (
					<>
						{[styles.brick1, styles.brick2, styles.brick3, styles.brick4].map(
							(cls) => (
								<div
									key={`${c}/${index}/${cls}`}
									className={cls}
									style={{
										filter: `hue-rotate(${hueShift + hueShiftLevel + tgdCalcRandom(hueRandom + hueRandomLevel)}deg)`,
									}}
								/>
							),
						)}
					</>
				))}
				<b>1</b>
				<b>2</b>
				<b>3</b>
				<b>4</b>
				<b>1</b>
				<b>2</b>
				<b>3</b>
				<b>4</b>
		</div>
			</div></fieldset>
            <fieldset><legend>Level</legend><div className={join(className, styles.hueSelector)}>
			<Slider value={hueShiftLevel} onChange={onHueShiftLevelChange} />
			<Slider value={hueRandomLevel} onChange={onHueRandomLevelChange} />
            </div></fieldset>
        </>
	);
}

function join(...classes: unknown[]): string {
	return classes.filter((cls) => typeof cls === "string").join(" ");
}

function Slider({
	value,
	onChange,
}: {
	value: number;
	onChange: (value: number) => void;
}) {
	return (
		<input
			type="range"
			min={0}
			max={360}
			value={value}
			onChange={(e) => onChange(Number(e.target.value))}
		/>
	);
}
