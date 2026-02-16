// Shared i18n page initialization helper
// Eliminates the duplicated initLanguage/subscribe/languageChange pattern across pages
import { languageStore, initLanguage, applyDomTranslations } from "@/i18n";

// Dedup guard keys stored on window
const guardMap = typeof window !== "undefined"
  ? ((window as Window & { __i18nGuards?: Set<string> }).__i18nGuards ??= new Set<string>())
  : new Set<string>();

/**
 * Standard page i18n setup: init language, run callback, subscribe to changes.
 * Handles deduplication of subscriptions across View Transitions.
 * @param onUpdate - callback to run on init and every language change (receives lang code)
 * @param guardKey - unique key to prevent duplicate subscriptions (defaults to page path)
 */
export function setupPageI18n(
  onUpdate?: (lang: string) => void,
  guardKey?: string,
) {
  const key = guardKey || `__i18n_${window.location.pathname}`;
  initLanguage();

  const run = () => {
    applyDomTranslations(document);
    onUpdate?.(languageStore.get());
  };

  run();

  if (!guardMap.has(key)) {
    guardMap.add(key);
    languageStore.subscribe(run);
  }
}
