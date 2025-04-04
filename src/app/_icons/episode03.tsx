export function IconEpisode03() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-110 -110 220 220"
            preserveAspectRatio="xMidYMid meet"
        >
            <mask id="myMask">
                <rect fill="white" x="-110" y="-110" width="220" height="220" />
                <circle fill="black" cx="-150" cy="0" r="150" />
            </mask>
            <circle
                mask="url(#myMask)"
                fill="currentColor"
                cx="0"
                cy="0"
                r="100"
            />
        </svg>
    )
}
