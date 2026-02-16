import { useEffect, useMemo, useState } from "react";
import { useStore } from "@nanostores/react";
import { AlertCircle, X } from "lucide-react";

import { languageStore, t } from "@/i18n";
import { completedLanguages } from "@/lib/constants";
import { useMounted } from "@/hooks";

export function LanguageNotice() {
  const currentLang = useStore(languageStore);
  const mounted = useMounted();
  const STORAGE_KEY = "languageNoticeDismissed";
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed === "true") setVisible(false);
    } catch (err) {
      // ignore localStorage errors (e.g., SSR or blocked storage)
    }
  }, []);

  const isComplete = useMemo(() => {
    const baseLang = currentLang?.split("-")[0];
    return completedLanguages.some((l) => currentLang === l || currentLang?.startsWith(l + "-") || baseLang === l);
  }, [currentLang]);

  if (!mounted || !visible || isComplete) return null;

  return (
    <div className="fixed top-16 inset-x-0 z-50 flex justify-center p-4">
      <div className="bg-amber-100 dark:bg-amber-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-100 px-4 py-3 rounded-lg shadow-md flex items-center max-w-xl">
        <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
        <p className="text-sm">{t("languageNotice.message")}</p>
        <button
          onClick={() => {
            setVisible(false);
            try {
              localStorage.setItem(STORAGE_KEY, "true");
            } catch (err) {
              // ignore localStorage errors
            }
          }}
          className="ml-4 p-1 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
          aria-label={t("languageNotice.dismiss")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
