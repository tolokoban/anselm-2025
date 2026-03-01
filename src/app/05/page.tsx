import { goto, makeGoto } from "@/app/routes"
import ViewBook from "@/components/ViewBook"
import Background from "@/generated/background"
import { useTranslator } from "./_translation"
import EpisodeSpeech from "@/components/EpisodeSpeech"
import Button from "@/components/Button"

export default function Page() {
    const tr = useTranslator()

    return (
        <EpisodeSpeech episode={5} mode="alien" text={tr.intro()}>
            <Button onClick={makeGoto("/05/play")}>{tr.start()}</Button>
        </EpisodeSpeech>
    )
}
