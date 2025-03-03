import { goto } from "@/app/routes"

import ViewBook from "@/components/ViewBook"
import { useTranslator } from "../_translation"

export default function Page() {
    const tr = useTranslator()
    const handleClick = () => {
        goto("/03")
        document.body.requestFullscreen()
    }

    return <ViewBook pages={[tr.win(), tr.next()]} onDone={handleClick} />
}
