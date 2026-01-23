import { assertType } from "./guards.ts"

export interface ConfigFile {
    make: Array<{
        name: string
        input: {
            path: string
        }
        output: {
            path: string
            columns?: number
        }
    }>
}

export function assertConfigFile(data: unknown): asserts data is ConfigFile {
    assertType(data, {
        make: [
            "array",
            {
                name: "string",
                input: {
                    path: "string",
                },
                output: {
                    path: "string",
                    columns: ["?", "number"],
                },
            },
        ],
    })
}
