import { goto } from "./routes"

import ViewBook from "@/components/ViewBook"

export default function Page() {
    const handleClick = () => {
        goto("/play")
        document.body.requestFullscreen()
    }
    return (
        <ViewBook
            pages={[
                `Cher Anselm,
Tu viens d'avoir 9 ans et tu es à mi-chemin de la majorité.
          
Du moins... d'après les critères Terrestres.`,
                `Mais tu dois t'en douter maintenant.
Tu ne viens pas vraiment de la Terre.
Et il est grand temps que tu rentres chez toi.`,
                `On t'a laissé une soucoupe, mais elle n'a pas encore assez d'énergie pour faire le voyage à travers la galaxie.`,
                `Pour faire le plein, clique sur l'écran ou appuie sur la barre d'espace.
Une centaine de bovins devrait faire l'affaire.
À très bientōt !`,
            ]}
            onDone={handleClick}
        />
    )
}
