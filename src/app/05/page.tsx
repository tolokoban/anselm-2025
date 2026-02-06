import { goto } from "@/app/routes"

import Background from "@/generated/background"
import ViewBook from "@/components/ViewBook"
import { useTranslator } from "./_translation"

export default function Page() {
    const tr = useTranslator()
    const handleClick = () => {
        goto("/05/play")
        document.body.requestFullscreen()
    }

    return (
        <div>
            <Background type="background" />
            <ViewBook
                pages={[tr.intro1(), tr.intro2(), tr.intro3()]}
                onDone={handleClick}
            />
        </div>
    )
}
