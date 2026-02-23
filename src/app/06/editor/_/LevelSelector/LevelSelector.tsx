import { IconChevronRight, IconCode, ViewButton } from "@tolokoban/ui";
import { useTranslator } from "@/app/06/_translation";
import LevelPreview05 from "@/components/05/LevelPreview05";
import { useArkanoidLevels } from "@/game/05/levels";
import styles from "./LevelSelector.module.css";

export interface GameProps {
	className?: string;
}

export function LevelSelector({ className }: GameProps) {
	const tr = useTranslator();
	const { levels, swapLevels } = useArkanoidLevels();
	const handleClipboard = () => {
		const content = JSON.stringify(levels, null, 4);
		navigator.clipboard.writeText(content).then(() => {
			console.log(content);
		});
	};

	return (
		<div>
			<div className={join(className, styles.game)}>
				<p>{tr.LevelSelector()}</p>
				<div>
					<div className={styles.grid}>
						{range(levels.length, (levelIndex) => (
							<div key={levelIndex}>
								<a href={`?level=${levelIndex}#/06/editor/${levelIndex}`}>
									<LevelPreview05
										className={styles.preview}
										level={levels[levelIndex]}
									/>
								</a>
								<div>
									<button
										type="button"
										onClick={() => {
											swapLevels(
												levelIndex,
												(levelIndex + levels.length - 1) % levels.length,
											);
										}}
									>
										&lt;
									</button>
									<button
										type="button"
										onClick={() => {
											swapLevels(levelIndex, (levelIndex + 1) % levels.length);
										}}
									>
										&gt;
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
				<details>
					<summary>
						<IconChevronRight />
						<div>Code:</div>
						<ViewButton onClick={handleClipboard} icon={IconCode}>
							Copy to clipboard
						</ViewButton>
					</summary>
					<pre>{JSON.stringify(levels, null, 4)}</pre>
				</details>
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
