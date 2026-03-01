import { goto } from "@/app/routes"

import { useTranslator } from "./_translation"
import EpisodeSpeech from "@/components/EpisodeSpeech"
import Button from "@/components/Button"

export default function Page() {
    const tr = useTranslator()
    const handleClick = () => {
        goto("/06/editor")
    }

    return (
        <EpisodeSpeech episode={5} mode="alien" text={tr.intro()}>
            <Button onClick={handleClick}>{tr.start()}</Button>
        </EpisodeSpeech>
    )
}
