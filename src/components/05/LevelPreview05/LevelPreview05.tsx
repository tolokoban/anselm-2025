import React from "react";
import { useEditor } from "@/game/05/editor";
import type { AssetsEdit } from "@/game/05/types";
import styles from "./LevelPreview05.module.css";

export interface LevelPreview05Props {
    className?: string;
    levelIndex: number;
    assets: AssetsEdit;
}

export default function LevelPreview05(
    { className, levelIndex, assets }: LevelPreview05Props,
) {
    const editor = useEditor();
    React.useEffect(() => {
        editor.installLevel(levelIndex, assets);
    }, [levelIndex, assets, editor]);

    return (
        <canvas
            className={join(className, styles.levelPreview05)}
            ref={editor.init}
        >
        </canvas>
    );
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ");
}
