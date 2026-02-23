import { goto } from "@/app/routes";
import ViewBook from "@/components/ViewBook";
import Background from "@/generated/background";
import { useTranslator } from "../_translation";

export default function Page() {
	const tr = useTranslator();
	const handleClick = () => {
		goto("/05/play");
		document.body.requestFullscreen();
	};

	return (
		<div>
			<Background type="background" />
			<ViewBook pages={[tr.gameover()]} onDone={handleClick} />
		</div>
	);
}
