import { debug } from "./debug"
import { intro } from "./intro"
import { laser } from "./laser"
import { pacman } from "./pacman"
import { spaceinvader } from "./spaceinvader"
import { upsideDown } from "./upside-down"

/**
 * All levels: https://strategywiki.org/wiki/Arkanoid:_Revenge_of_Doh/Walkthrough
 */

export const ArkanoidLevels = [intro, spaceinvader, laser, upsideDown, pacman]
