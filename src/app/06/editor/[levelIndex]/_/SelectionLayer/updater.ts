import { TgdEvent } from "@tolokoban/tgd";
import React from "react";
import { useArkanoidLevels } from "@/game/05/levels";
import type { ArkanoidLevel } from "@/game/05/levels/types";
import { useEventValue } from "@/utils/event";
import type { AreaSelection } from "./types";
import { LevelUndoManager } from "./undo";

export class LevelUpdater {
	public readonly eventChange = new TgdEvent<ArkanoidLevel>();

	private readonly manager = new LevelUndoManager(this.eventChange, {
		pose: [],
		backgroundIndex: 0,
	});

	get level() {
		return this.manager.level;
	}

	undo() {
		this.manager.undo();
	}

	update(value: Partial<ArkanoidLevel>) {
		this.manager.update({ ...this.level, ...value });
	}

	reset(level: ArkanoidLevel) {
		this.manager.reset(level);
	}

	clear(selection: AreaSelection) {
		const level = structuredClone(this.manager.level);
		for (let row = selection.row1; row <= selection.row2; row++) {
			const line = level.pose[row];
			if (!line) continue;

			level.pose[row] =
				line.slice(0, selection.col1) +
				" ".repeat(selection.col2 - selection.col1 + 2) +
				line.slice(selection.col2 + 2);
		}
		console.log(level);
		this.manager.update(level);
	}

	fill(selection: AreaSelection, type: "[" | "(" | "{" | "<") {
		const level = structuredClone(this.manager.level);
		for (let row = selection.row1; row <= selection.row2; row++) {
			for (let col = selection.col1; col < selection.col2 + 1; col += 2) {
				set(level, col, row, type);
			}
		}
		this.manager.update(level);
	}

	fillBonus(selection: AreaSelection, type: number) {
		const BONUS = "ABCDEFGHIJ";
		const level = structuredClone(this.manager.level);
		for (let row = selection.row1; row <= selection.row2; row++) {
			for (let col = selection.col1; col < selection.col2 + 1; col++) {
				const char = get(level, col, row);
				if (!char) continue;

				console.log("🐞 [updater@64] char =", char); // @FIXME: Remove this line written on 2026-02-23 at 18:51
				if ("[<(".includes(char)) {
					if (type < 0) {
						set(level, col + 1, row, "-");
					} else {
						set(level, col + 1, row, BONUS.charAt(type));
						level.options = {
							...level.options,
							[BONUS.charAt(type)]: {
								bonus: type,
							},
						};
					}
				}
			}
		}
		this.manager.update(level);
	}
}

function set(level: ArkanoidLevel, col: number, row: number, char: string) {
	const FULL_LINE = " ".repeat(26);
	while (level.pose.length <= row) level.pose.push(FULL_LINE);
	const chars = level.pose[row].split("");
	chars[col] = char;
	level.pose[row] = chars.join("");
}

function get(level: ArkanoidLevel, col: number, row: number) {
	const chars = level.pose[row].split("");
	return chars[col];
}

export function useLevelUpdater(levelIndex: number) {
	const { levels, updateLevel } = useArkanoidLevels();
	const ref = React.useRef<LevelUpdater | null>(null);
	if (!ref.current) ref.current = new LevelUpdater();
	// biome-ignore lint/correctness/useExhaustiveDependencies: prevent infinite loop
	React.useMemo(() => {
		const level = levels[levelIndex];
		ref.current?.reset(level);
	}, [levelIndex]);
	const level = useEventValue(levels[levelIndex], ref.current.eventChange);
	// biome-ignore lint/correctness/useExhaustiveDependencies: prevent infinite loop
	React.useMemo(() => {
		updateLevel(levelIndex, level);
	}, [level, levelIndex]);
	return {
		level,
		updater: ref.current,
	};
}
