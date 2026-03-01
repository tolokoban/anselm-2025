import { goto } from "@/app/routes"
import { StateArkanoid } from "@/game/05/levels"
import { useTranslator } from "../_translation"
import EpisodeSpeech from "@/components/EpisodeSpeech"
import Button from "@/components/Button"

export default function Page() {
    const tr = useTranslator()
    const handleClick = () => {
        StateArkanoid.lifes.value = 3
        goto("/05/play")
    }

    return (
        <EpisodeSpeech episode={5} mode="alien" text={tr.gameover()}>
            <Button onClick={handleClick}>{tr.retry()}</Button>
        </EpisodeSpeech>
    )
}
