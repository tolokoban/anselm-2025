import Process from "node:process"
import Chalk from "chalk"

export function printTitle() {
    const title = "Make Atlas v0.1.0"
    const sep = " ".repeat(title.length + 4)
    console.log()
    console.log(Chalk.bold.bgCyanBright(sep))
    console.log(Chalk.bold.bgCyanBright.black.bold(`  ${title}  `))
    console.log(Chalk.bold.bgCyanBright(sep))
    console.log()
}
