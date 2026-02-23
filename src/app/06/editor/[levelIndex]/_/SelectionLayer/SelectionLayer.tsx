import React from "react";
import styles from "./SelectionLayer.module.css";
import type { SelectionViewer } from "./viewer";

export interface SelectionLayerProps {
	className?: string;
	viewer: SelectionViewer;
}

export default function SelectionLayer({
	className,
	viewer,
}: SelectionLayerProps) {
	return (
		<canvas
			className={join(className, styles.selectionLayer)}
			ref={viewer.init}
		></canvas>
	);
}

function join(...classes: unknown[]): string {
	return classes.filter((cls) => typeof cls === "string").join(" ");
}
