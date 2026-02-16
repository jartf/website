import { memo, useEffect, useMemo, useState } from "react";
import { useStore } from "@nanostores/react";
import { PartyPopper, X } from "lucide-react";

import { languageStore } from "@/i18n";
import { supportedLanguages } from "@/lib/constants";
import { useMounted } from "@/hooks";

const LANGUAGE_TRACKER_KEY = "language-tracker";

function readVisited(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(LANGUAGE_TRACKER_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function writeVisited(value: Set<string>) {
  if (typeof window === "undefined") return;
  if (value.size === 0) {
    localStorage.removeItem(LANGUAGE_TRACKER_KEY);
    return;
  }
  localStorage.setItem(LANGUAGE_TRACKER_KEY, JSON.stringify([...value]));
}

export const EasterEgg = memo(function EasterEgg() {
  const currentLang = useStore(languageStore);
  const mounted = useMounted();
  const [visible, setVisible] = useState(false);
  const [visited, setVisited] = useState<Set<string>>(() => readVisited());

  useEffect(() => {
    if (!mounted) return;
    if (!currentLang) return;

    setVisited((prev) => {
      const next = new Set(prev);
      next.add(currentLang);
      writeVisited(next);
      return next;
    });
  }, [mounted, currentLang]);

  const allLanguagesVisited = useMemo(() => {
    if (!mounted) return false;
    return supportedLanguages.every((lang) => visited.has(lang.code));
  }, [mounted, visited]);

  useEffect(() => {
    if (!mounted) return;
    if (!allLanguagesVisited) return;
    queueMicrotask(() => setVisible(true));
  }, [mounted, allLanguagesVisited]);

  const handleDismiss = () => {
    setVisible(false);
    setVisited(new Set());
    writeVisited(new Set());
  };

  if (!mounted || !visible) return null;

  return (
    <div className="fixed top-16 inset-x-0 z-50 flex justify-center p-4">
      <div className="bg-purple-100 dark:bg-purple-900 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-100 px-4 py-3 rounded-lg shadow-md flex items-center max-w-xl">
        <PartyPopper className="h-5 w-5 mr-3 flex-shrink-0" />
        <div className="flex flex-col">
          <p className="text-sm font-medium">Achievement Unlocked: Polyglot!</p>
          <p className="text-xs opacity-80">You&apos;ve visited all {supportedLanguages.length} language versions of this site. Impressive!</p>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 p-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});
