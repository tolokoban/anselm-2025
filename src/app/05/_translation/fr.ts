import type { Translation } from "@/lang";

const FR = {
	gameover: [
		`Oups ! Je crois que tu as cassé toutes les raquettes télécommandée...`,
		"On va dire que c'était un entrainement. Mais je suis sūr que tu vas y arriver au prochain essai.",
		"C'est vraiment dommage qu'il n'y ait que 3 robots-raquettes. Mais on va en construire d'autre sous peu.",
		"Tu peux recommencer autant de fois que tu veux. Alors, pas de panique.",
	],
	intro1: `Désolé de te faire patienter Anselm,
mais la tour de contrôle ne veut pas nous donner le feu vert pour le décollage.
Il semblerait que la météo des météorites soit mauvaise en ce moment,
et que les conditions de vol soient trop dangereuses.`,
	intro2: `En attendant, je te propose de faire un peu de ménage de façon ludique.

Dans les salles de cette base lunaire, il reste de nombreuses caisses inutilisées dont il faudrait se débarrasser.`,
	intro3: `Comme les salles ne sont pas pressurisées, on va envoyer un petit robot que tu télécommanderas.
Grâce à lui, tu pourras diriger une balle en métal sur les caisses pour les détruire.

Amuse-toi bien, et on te tient au courant de la météo.`,
	lifes: "Vies:",
	loading: "Chargement... ",
	start: `C'est parti !`,
	win: `Super ! Te voilà arrivé dans la base sous-lunaire.
    
Repose-toi bien : demain, on part avec le gros vaisseau !`,
} satisfies Translation;

export default FR;
