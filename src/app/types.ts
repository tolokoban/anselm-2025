/**
 * build-react-routes
 *
 * WARNING! this file has been generated automatically.
 * Please do not edit it because it will probably be overwritten.
 *
 * If you find a bug or if you need an improvement, please fill an issue:
 * https://github.com/tolokoban/build-react-routes/issues
 */
export type RoutePath =
    | "/"
    | "/01"
    | "/01/dead"
    | "/01/play"
    | "/02"
    | "/02/dead"
    | "/02/help"
    | "/02/play"
    | "/02/win"
    | "/03"
    | "/03/play"
    | "/04"

export function isRoutePath(path: string): path is RoutePath {
    return ["/","/01","/01/dead","/01/play","/02","/02/dead","/02/help","/02/play","/02/win","/03","/03/play","/04"].includes(path)
}

export interface RouteMatch {
    path: string
    route: RoutePath
    params: Record<string, string>
    /**
     * 0 means a perfect match.
     */
    distance: number
}
