import { useTranslator } from "@/app/05/_translation";
import LevelPreview05 from "@/components/05/LevelPreview05";
import { ArkanoidLevels } from "@/game/05/levels";
import type { AssetsEdit } from "@/game/05/types";
import styles from "./Game.module.css";

export interface GameProps {
    className?: string;
    assets: AssetsEdit;
}

export default function Game({ className, assets }: GameProps) {
    const tr = useTranslator();

    return (
        <div>
            <div className={join(className, styles.game)}>
                <div className={styles.grid}>
                    {range(
                        ArkanoidLevels.length,
                        (levelIndex) => (
                            <a
                                target="_test"
                                href={`?level=${levelIndex}#/05/play`}
                                key={levelIndex}
                            >
                                <LevelPreview05
                                    className={styles.preview}
                                    levelIndex={levelIndex}
                                    assets={assets}
                                />
                            </a>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ");
}

function range<T>(count: number, callback: (index: number) => T): T[] {
    return new Array(count).fill(0).map((_, index) => callback(index));
}
