import { isString } from "@tolokoban/type-guards"

export function classNames(...cls: unknown[]): string {
    return cls.filter(isString).join(" ")
}
