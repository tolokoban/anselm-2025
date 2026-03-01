import type FR from "./fr"

const EN: typeof FR = {
    gameover: [
        "Oops! I think you broke all the remote-controlled rackets...",
        "Let's just say it was practice. But I'm sure you'll get it right next time.",
        "It's a real shame there are only 3 robot rackets. But we'll build more soon.",
        "You can try again as many times as you like. So, don't panic.",
    ],
    intro: `Sorry to keep you waiting, Anselm,
but the control tower won't give us the go-ahead for takeoff.

It seems the meteorite weather is bad right now, and the flight conditions are too dangerous.

In the meantime, I suggest we do some fun cleaning up.

There are many unused crates in the rooms of this lunar base that we need to get rid of.
Since the rooms aren't pressurized, we'll send in a small robot that you can control remotel
With it, you can aim a metal ball at the crates to destroy them.

Have fun, and we'll keep you updated on the weather.`,
    lifes: "Lifes:",
    loading: "Loading... ",
    retry: "Shall we start again?",
    start: `Let's start!`,
}

export default EN
