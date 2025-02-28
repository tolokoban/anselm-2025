import { Translation } from "@/lang"
import FR from "./fr"
import { translateInAlienLanguage } from "@/lang/alien"

const ALIEN: typeof FR = translateInAlienLanguage(FR)

export default ALIEN
