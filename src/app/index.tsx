/**
 * build-react-routes
 *
 * WARNING! this file has been generated automatically.
 * Please do not edit it because it will probably be overwritten.
 *
 * If you find a bug or if you need an improvement, please fill an issue:
 * https://github.com/tolokoban/build-react-routes/issues
 */

export * from "./routes"
export * from "./types"

import React from "react"

import { matchRoute, useRouteContext, ROUTES } from "./routes"
import { RouteMatch, RoutePath } from "./types"

import Layout0 from "./layout"
import Layout1 from "./01/layout"
import Layout4 from "./02/layout"
import Loading0 from "./loading"
const Page0 = React.lazy(() => import("./page"))
const Page1 = React.lazy(() => import("./01/page"))
const Page2 = React.lazy(() => import("./01/dead/page"))
const Page3 = React.lazy(() => import("./01/play/page"))
const Page4 = React.lazy(() => import("./02/page"))
const Page5 = React.lazy(() => import("./02/dead/page"))
const Page6 = React.lazy(() => import("./02/help/page"))
const Page7 = React.lazy(() => import("./02/play/page"))
const Page8 = React.lazy(() => import("./02/win/page"))
const Page9 = React.lazy(() => import("./03/page"))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function App({ lang }: { lang?: string }) {
    const context = useRouteContext()
    const fb0 = <Loading0/>
    const ly0 = Layout0
    const pg0 = Page0
    const ly1 = Layout1
    const pg1 = Page1
    const pg2 = Page2
    const pg3 = Page3
    const ly4 = Layout4
    const pg4 = Page4
    const pg5 = Page5
    const pg6 = Page6
    const pg7 = Page7
    const pg8 = Page8
    const pg9 = Page9
    return (
        <Route path="/" Page={pg0} Layout={ly0} fallback={fb0} context={context}>
            <Route path="/01" Page={pg1} Layout={ly1} fallback={fb0} context={context}>
                <Route path="/01/dead" Page={pg2} fallback={fb0} context={context}/>
                <Route path="/01/play" Page={pg3} fallback={fb0} context={context}/>
            </Route>
            <Route path="/02" Page={pg4} Layout={ly4} fallback={fb0} context={context}>
                <Route path="/02/dead" Page={pg5} fallback={fb0} context={context}/>
                <Route path="/02/help" Page={pg6} fallback={fb0} context={context}/>
                <Route path="/02/play" Page={pg7} fallback={fb0} context={context}/>
                <Route path="/02/win" Page={pg8} fallback={fb0} context={context}/>
            </Route>
            <Route path="/03" Page={pg9} fallback={fb0} context={context}/>
        </Route>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function intl<T extends PageComponent | ContainerComponent | JSX.Element>(
    page: T,
    translations: Record<string, T>,
    lang = ""
): T {
    const candidate1 = translations[lang]
    if (candidate1) return candidate1

    const [prefix] = lang.split("-")
    const candidate2 = translations[prefix]
    if (candidate2) return candidate2

    return page
}

type PageComponent = React.FC<{ params: Record<string, string> }>
type ContainerComponent = React.FC<{
    children: React.ReactNode
    params: Record<string, string>
}>

interface RouteProps {
    path: string
    element?: JSX.Element
    fallback?: JSX.Element
    children?: React.ReactNode
    Page?: PageComponent
    Layout?: ContainerComponent
    Template?: ContainerComponent
    context: RouteMatch | null
}

function Route({
    path,
    fallback,
    children,
    Page,
    Layout,
    Template,
    context,
}: RouteProps) {
    const match = context && matchRoute(context.path, ROUTES[path as RoutePath])

    if (!match) return null

    if (match.distance === 0) {
        if (!Page) return null

        const element = Template ? (
            <Template params={match.params}>
                <Page params={match.params} />
            </Template>
        ) : (
            <Page params={match.params} />
        )
        if (Layout) {
            return (
                <Layout params={match.params}>
                    <React.Suspense fallback={fallback}>
                        {element}
                    </React.Suspense>
                </Layout>
            )
        }
        return <React.Suspense fallback={fallback}>{element}</React.Suspense>
    }
    return Layout ? (
        <Layout params={match.params}>{children}</Layout>
    ) : (
        <>{children}</>
    )
}
