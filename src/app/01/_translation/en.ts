import { Translation } from "@/lang"
import FR from "./fr"

const scoreCow = [
    "cow",
    "cow",
    "cow",
    "cow",
    "bug",
    "milkmaid",
    "moo-moo",
    "Daisy",
    "beast",
]

const scoreEat = [
    "absorbed",
    "sucked up",
    "caught",
    "swallowed",
    "captured",
    "torn apart",
    "cut up",
    "disintegrated",
    "digested",
    "skinned",
    "imprisoned",
    "engulfed",
    "liquidated",
    "eaten",
    "pulverized",
]

const EN: typeof FR = {
    congrats: [
        "It's a new record!!!",
        "Old record smashed!!!",
        "You're making progress! Well done!!!",
        "Hey presto! New record!!!",
        "You're making progress too well!!!",
        "You've done even better!!!",
        "You're surpassing yourself Anselm!!!",
        "Better and better Ansy!!!",
    ],
    gameOver: [
        "Ouch... You really blew yourself up there!",
        "You crashed beautifully!",
        "You grazed the daisies!",
        "Gravity caught up with you!",
        "You hurt my ship!",
        "Oh! That must hurt!",
        "Are you sure you have your license?",
        "Let's pretend we didn't see anything...",
        "Hey! Do you know how much a saucer costs?",
        "You scratched the paint there!",
        "Remind me never to get on a ship with you...",
        "You hit the ground running!",
        "Boom! In your face!",
        "Then my mechanic is going to be happy...",
    ],
    intro1: `Dear Anselm,
You've just turned 9 and are halfway to coming of age.

At least... by Earth standards.`,
    intro2: `But you must have guessed by now:
you're not really from Earth...

And it's about time you went home.`,
    intro3: `We left you a saucer, but it doesn't have enough energy to make the trip across the galaxy yet.`,
    intro4: `To refuel, click on the screen or press the space bar.
A hundred cattle should do the trick.

$1`,
    highscore: [
        "Record to beat: $1.",
        "Previous record: $1",
        "Can you beat $1?",
        "You've already achieved $1.",
        "Highest score: $1.",
    ],
    score: "$2 $1",
    scoreCow,
    scoreCows: scoreCow.map((w) => `${w}s`),
    scoreEat,
    scoreEats: scoreEat,
    seeYou: "See you very soon ANSELM !!!",
}

export default EN
