import { GameStorage } from "./storage";

export const Unlocked = {
	get ep02() {
		return GameStorage.ep01.total >= 30;
	},
	get ep06() {
		return GameStorage.ep05.victories > 0;
	},
};
