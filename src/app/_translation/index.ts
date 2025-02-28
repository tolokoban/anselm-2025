import { useTanslationGeneric } from "@/lang"
import FR from "./fr"

export function useTranslation() {
    return useTanslationGeneric(FR, {
        en: () => import("./en"),
        alien: () => import("./alien"),
    })
}
