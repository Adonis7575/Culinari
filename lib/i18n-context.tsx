"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { usePersistentState } from "../hooks/usePersistentState";
import {
  DEFAULT_LANGUAGE,
  detectLanguage,
  getLanguage,
  isLanguageCode,
  localizeError,
  translate,
  translateTerm,
  type Language,
  type LanguageCode,
  type TranslateVars,
  type UIKey,
} from "./i18n";

export const LANGUAGE_STORAGE_KEY = "culina.language.v1";

interface I18nValue {
  lang: LanguageCode;
  language: Language;
  setLang: (code: LanguageCode) => void;
  t: (key: UIKey, vars?: TranslateVars) => string;
  term: (english: string) => string;
  localizeError: (message: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const subscribeToNothing = () => () => {};
const browserLanguage = () => detectLanguage(
  typeof navigator === "undefined" ? [] : (navigator.languages?.length ? navigator.languages : [navigator.language])
);
const serverLanguage = () => DEFAULT_LANGUAGE;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // An explicit choice wins; until then, follow the browser's preferred language.
  const [stored, setStored] = usePersistentState<string>(LANGUAGE_STORAGE_KEY, "");
  const detected = useSyncExternalStore(subscribeToNothing, browserLanguage, serverLanguage);
  const lang: LanguageCode = isLanguageCode(stored) ? stored : detected;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((code: LanguageCode) => setStored(code), [setStored]);

  const value = useMemo<I18nValue>(() => ({
    lang,
    language: getLanguage(lang),
    setLang,
    t: (key, vars) => translate(lang, key, vars),
    term: english => translateTerm(lang, english),
    localizeError: message => localizeError(lang, message),
  }), [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside LanguageProvider");
  return context;
}
