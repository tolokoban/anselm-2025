import React from "react";

import { useLang } from "@/lang";

import EnglishFlagURL from "./en.png";
import FrenchFlagURL from "./fr.png";
import AlienFlagURL from "./alien.png"

import Styles from "./LanguageSelector.module.css"

export interface LanguageSelectorProps {
    className?: string
}

const FLAGS: Record<string, string> = {
    fr: FrenchFlagURL,
    en: EnglishFlagURL,
    alien: AlienFlagURL,
}

export default function LanguageSelector({ className }: LanguageSelectorProps) {
    const [lang, setLang] = useLang()
    return (
        <div className={join(className, Styles.languageselector)}>
            {["fr", "en", "alien"].map((key) => (
                <button
                    className={join(lang.startsWith(key) && Styles.current)}
                    key={key}
                    type="button"
                    onClick={() => setLang(key)}
                >
                    <img src={FLAGS[key]} />
                </button>
            ))}
        </div>
    )
}

function join(...classes: unknown[]): string {
  return classes.filter((cls) => typeof cls === "string").join(" ");
}
