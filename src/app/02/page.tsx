import { getHighscore } from "@/highscore"
import { goto } from "@/app/routes"

import ViewBook from "@/components/ViewBook"
import { useTranslator } from "./_translation"

export default function Page() {
    const tr = useTranslator()
    const handleClick = () => {
        goto("/01/play")
        document.body.requestFullscreen()
    }

    return (
        <ViewBook
            pages={[tr.intro1(), tr.intro2(), tr.intro3()]}
            onDone={handleClick}
        />
    )
}
