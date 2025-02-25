import { goto, makeGoto } from "./routes"

export default function Page() {
    const handleClick = () => {
        goto("/play")
        document.body.requestFullscreen()
    }
    return (
        <div>
            Hello world
            <br />
            <button onClick={handleClick}>I want to play now!</button>
        </div>
    )
}
