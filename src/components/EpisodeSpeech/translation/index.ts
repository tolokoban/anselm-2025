import { useTanslatorGeneric } from "@/lang"
import FR from "./fr"

export function useTranslator() {
    return useTanslatorGeneric(FR, {
        en: () => import("./en"),
        alien: () => import("./alien"),
    })
}
