import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { LangCode } from "../i18n";
import { getTranslation } from "../i18n";

interface LanguageContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    const stored = localStorage.getItem("sahayak_lang");
    return (stored as LangCode) || "en";
  });

  function setLang(newLang: LangCode) {
    setLangState(newLang);
    localStorage.setItem("sahayak_lang", newLang);
  }

  const t = (key: string) => getTranslation(lang, key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
