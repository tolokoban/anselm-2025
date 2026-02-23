import React from "react";
import LanguageSelector from "@/components/LanguageSelector";
import Background from "@/generated/background";
import { version } from "@/package.json";
import { Unlocked } from "@/unlocked";
import { IconEpisode01 } from "./_icons/episode01";
import { IconEpisode02 } from "./_icons/episode02";
import { IconEpisode03 } from "./_icons/episode03";
import { IconEpisode04 } from "./_icons/episode04";
import { IconEpisode05 } from "./_icons/episode05";
import { IconEpisode06 } from "./_icons/episode06";
import { useTranslator } from "./_translation";
import styles from "./page.module.css";
import { goto } from "./routes";
import type { RoutePath } from "./types";

export default function Page() {
	const refScroll = React.useRef<HTMLElement | null>(null);
	const [showLeft, setShowLeft] = React.useState(false);
	const [showRight, setShowRight] = React.useState(true);
	const tr = useTranslator();
	const go = (path: RoutePath) => {
		goto(path);
		document.body.requestFullscreen();
	};
	const handleScroll = (): void => {
		const target = refScroll.current;
		if (!target) return;

		setShowLeft(target.scrollLeft > 0);
		setShowRight(target.scrollLeft + target.clientWidth < target.scrollWidth);
	};
	const handleRight = () => {
		const target = refScroll.current;
		if (!target) return;

		const w = Math.min(window.innerWidth, window.innerHeight);
		const s = 0.45 * w;
		target.scrollTo({
			left: (Math.floor(target.clientLeft / s) + 1) * s,
			behavior: "smooth",
		});
	};
	const handleLeft = () => {
		const target = refScroll.current;
		if (!target) return;

		const w = Math.min(window.innerWidth, window.innerHeight);
		const s = 0.45 * w;
		target.scrollTo({
			left: (Math.floor(target.clientLeft / s) - 1) * s,
			behavior: "smooth",
		});
	};
	React.useEffect(handleScroll, []);

	return (
		<div className={styles.main}>
			<Background type="background" />
			<div>
				<h1>
					<div>
						Ansy-2025 <small>(version {version})</small>
					</div>
					<LanguageSelector className={styles.languageSelector} />
				</h1>
				<p> {tr.intro()} </p>
				<footer ref={refScroll} onScroll={handleScroll}>
					<button type="button" onClick={() => go("/01")}>
						<IconEpisode01 />
						<div>{tr.episode()} 01</div>
					</button>
					<button
						type="button"
						onClick={() => go("/02")}
						// disabled={!Unlocked.ep02}
					>
						<IconEpisode02 />
						<div>{tr.episode()} 02</div>
					</button>
					<button type="button" onClick={() => go("/03")}>
						<IconEpisode03 />
						<div>{tr.episode()} 03</div>
					</button>
					<button type="button" onClick={() => go("/04")}>
						<IconEpisode04 />
						<div>{tr.episode()} 04</div>
					</button>
					<button type="button" onClick={() => go("/05")}>
						<IconEpisode05 />
						<div>{tr.episode()} 05</div>
					</button>
					<button
						type="button"
						onClick={() => go("/06")}
						disabled={!Unlocked.ep06}
					>
						<IconEpisode06 />
						<div>{tr.episode()} 06</div>
					</button>
				</footer>
			</div>
			<button
				type="button"
				onClick={handleLeft}
				className={join(styles.left, showLeft && styles.show)}
			>
				&lt;
			</button>
			<button
				type="button"
				onClick={handleRight}
				className={join(styles.right, showRight && styles.show)}
			>
				&gt;
			</button>
		</div>
	);
}

function join(...classes: unknown[]): string {
	return classes.filter((cls) => typeof cls === "string").join(" ");
}
