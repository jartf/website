// Shared i18n page initialization helper
// Eliminates the duplicated initLanguage/subscribe/languageChange pattern across pages
import { languageStore, initLanguage, applyDomTranslations } from "@/i18n";

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

  if (!(window as any)[key]) {
    (window as any)[key] = true;
    languageStore.subscribe(run);
  }
}
