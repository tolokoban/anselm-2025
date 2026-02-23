import { goto } from "@/app/routes";

import ViewBook from "@/components/ViewBook";
import WorkInProgress from "@/components/WorkInProgress";
import { useTranslator } from "./_translation";

export default function Page() {
	const tr = useTranslator();
	const handleClick = () => {
		goto("/");
		document.body.requestFullscreen();
	};

	return <WorkInProgress />;
}
