import { goto } from "@/app/routes"

import ViewBook from "@/components/ViewBook"
import { useTranslator } from "./_translation"
import { GameStorage } from "@/storage"

export default function Page() {
    const tr = useTranslator()
    const handleClick = () => {
        goto("/01/play")
        document.body.requestFullscreen()
    }
    const highscore = GameStorage.ep01.highscore

    return <ViewBook pages={[tr.intro1(), tr.intro2()]} onDone={handleClick} />
}
