import React from "react";
import { useEditor } from "@/game/05/editor";
import type { ArkanoidLevel } from "@/game/05/levels/types";
import AtlasBonusesURL from "@/gfx/05/bonuses.webp";
import AtlasBricksURL from "@/gfx/05/bricks.webp";
import { useAssetsImages } from "@/utils/assets";

import styles from "./LevelPreview05.module.css";

export interface LevelPreview05Props {
	className?: string;
	level: ArkanoidLevel;
}

export default function LevelPreview05({
	className,
	level,
}: LevelPreview05Props) {
	const assets = useAssetsImages({
		atlasBricks: AtlasBricksURL,
		atlasBonuses: AtlasBonusesURL,
	});
	const editor = useEditor();
	React.useEffect(() => {
        if (!assets)return

		editor.installLevel(level, assets);
	}, [level, assets, editor]);

	return (
		<canvas
			className={join(className, styles.levelPreview05)}
			ref={editor.init}
		></canvas>
	);
}

function join(...classes: unknown[]): string {
	return classes.filter((cls) => typeof cls === "string").join(" ");
}
