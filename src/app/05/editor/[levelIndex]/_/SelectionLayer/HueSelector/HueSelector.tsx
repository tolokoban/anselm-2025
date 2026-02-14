import React from "react";

import styles from "./HueSelector.module.css";

export interface HueSelectorProps {
	className?: string;
	hueShift: number;
	hueRandom: number;
	onHueShiftChange: (hueShift: number) => void;
	onHueRandomChange: (hueRandom: number) => void;
}

export default function HueSelector({
	className,
	hueShift,
	hueRandom,
	onHueShiftChange,
	onHueRandomChange,
}: HueSelectorProps) {
	return (
		<div className={join(className, styles.hueSelector)}>
			<Slider value={hueShift} onChange={onHueShiftChange} />
			<Slider value={hueRandom} onChange={onHueRandomChange} />
			<div className={styles.grid}>
				<div
					className={styles.brick1}
					style={{ filter: `hue-rotate(${hueShift}deg)` }}
				/>
				<div
					className={styles.brick2}
					style={{ filter: `hue-rotate(${hueShift}deg)` }}
				/>
				<div
					className={styles.brick3}
					style={{ filter: `hue-rotate(${hueShift}deg)` }}
				/>
				<div
					className={styles.brick4}
					style={{ filter: `hue-rotate(${hueShift}deg)` }}
				/>
				<div
					className={styles.brick1}
					style={{ filter: `hue-rotate(${hueShift + hueRandom}deg)` }}
				/>
				<div
					className={styles.brick2}
					style={{ filter: `hue-rotate(${hueShift + hueRandom}deg)` }}
				/>
				<div
					className={styles.brick3}
					style={{ filter: `hue-rotate(${hueShift + hueRandom}deg)` }}
				/>
				<div
					className={styles.brick4}
					style={{ filter: `hue-rotate(${hueShift + hueRandom}deg)` }}
				/>
                <b>1</b><b>2</b><b>3</b><b>4</b>
			</div>
		</div>
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
