import { tgdLoadAssets, type WebglImage } from "@tolokoban/tgd";
import React from "react";
import AtlasBonusesURL from "@/gfx/05/bonuses.webp";
import AtlasBricksURL from "@/gfx/05/bricks.webp";
import Game from "./_/Game";
import Spinner from "./_/Spinner";

export default function Page05() {
	const [images, setImages] = React.useState<WebglImage[] | undefined>(
		undefined,
	);
	React.useEffect(() => {
		const all = Promise.all([
			tgdLoadAssets({
				img: {
					atlasBricks: AtlasBricksURL,
					atlasBonuses: AtlasBonusesURL,
				},
			}),
			sleep(1),
		]);
		all.then(([assets]) => {
			const { atlasBricks, atlasBonuses } =
				assets.img;
			if (
				!atlasBricks ||
				!atlasBonuses
			) {
				console.error("Unable to load atlas:", AtlasBricksURL);
				throw new Error("Unable to load atlas!");
			}
			setImages([
				atlasBricks,
				atlasBonuses,
			]);
		});
	}, []);

	if (!images) return <Spinner />;

	const [atlasBricks, atlasBonuses] =
		images;
	return (
		<Game
			assets={{ atlasBricks, atlasBonuses }}
		/>
	);
}

function sleep(delay: number) {
	return new Promise((resolve) => globalThis.setTimeout(resolve, delay));
}
