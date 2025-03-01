import { useTanslatorGeneric } from "@/lang"
import EN from "./en"

export function useTranslation() {
    return useTanslatorGeneric(EN, { fr: () => import("./fr") })
}
