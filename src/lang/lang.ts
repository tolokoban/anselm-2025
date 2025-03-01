import AtomicState from "@tolokoban/react-state";
import { isString } from "@tolokoban/type-guards";
import React from "react";

const initialLang = (
    localStorage.getItem("Language") ??
    navigator.language ??
    "fr"
)
    .split("-")[0]
    .toLocaleLowerCase()

const atomicLanguage = new AtomicState(initialLang, {
  storage: {
    id: "Language",
    guard: isString,
  },
});

export function useLang(): [string, (v: string) => void] {
  return atomicLanguage.useState();
}

export function useLangValue() {
  const [lang] = useLang();
  return lang;
}

export type Translation = Record<string, string | string[]>

export type Translator<T extends Translation> = Readonly<{
    [key in keyof T]: (...vars: string[]) => string
}>

export function useTanslatorGeneric<T extends Translation>(
    defaultTranslation: T,
    otherTranslations: Record<string, () => Promise<{ default: T }>>
): Readonly<Translator<T>> {
    const [translation, setTranslation] = React.useState(defaultTranslation)
    const lang = useLangValue()
    React.useEffect(() => {
        const variations = getLangVariations(lang)
        for (const key of Object.keys(otherTranslations)) {
            if (variations.includes(key)) {
                otherTranslations[key]()
                    .then((obj) => setTranslation(obj.default))
                    .catch((ex) =>
                        console.error(
                            `Unable to load translation for language "${key}"!`,
                            ex
                        )
                    )
                return
            }
        }
        setTranslation(defaultTranslation)
    }, [lang, defaultTranslation, otherTranslations])
    return makeTranslator<T>(translation)
}

function makeTranslator<T extends Translation>(dico: T): Translator<T> {
    const tr: Record<string, (...vars: string[]) => string> = {}
    for (const key of Object.keys(dico)) {
        tr[key] = (...vars: string[]) => {
            let text = pick(dico[key])
            vars.forEach((repl, index) => {
                text = text.replace(new RegExp(`\\$${index + 1}`), repl)
            })
            return text
        }
    }
    return tr as Translator<T>
}

function pick(arr: string | string[]): string {
    if (!Array.isArray(arr)) return arr

    const i = Math.floor(Math.random() * arr.length)
    return arr[i]
}

/**
 * Returns languages veriations from the most specific to the less specific.
 * @example
 * ```
 * getVersion("sgn-BE-FR") = [
 *   "sgn-BE-FR",
 *   "sgn-BE",
 *   "sgn"
 * ]
 */
function getLangVariations(lang: string): string[] {
  const parts = lang.split("-");
  const versions: string[] = [];
  while (parts.length > 0) {
    versions.push(parts.join("-"));
    parts.pop();
  }
  return versions;
}
