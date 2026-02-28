import { goto } from "@/app/routes"
import ViewBook from "@/components/ViewBook"
import { StateArkanoid } from "@/game/05/levels"
import Background from "@/generated/background"
import { useTranslator } from "../_translation"

export default function Page() {
    const tr = useTranslator()
    const handleClick = () => {
        StateArkanoid.lifes.value = 3
        goto("/05/play")
        document.body.requestFullscreen()
    }

    return (
        <div>
            <Background type="background" />
            <ViewBook pages={[tr.gameover()]} onDone={handleClick} />
        </div>
    )
}
