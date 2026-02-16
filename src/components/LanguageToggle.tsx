import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { languageStore, setLanguage, supportedLanguages, currentTranslations, type SupportedLanguage } from '@/i18n';

export function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentLang = useStore(languageStore);
  const translations = useStore(currentTranslations);

  useEffect(() => {
    // Use pre-detected language if available for faster initialization
    const initialLang = (window as any).__INITIAL_LANG__;
    if (initialLang && initialLang !== languageStore.get()) {
      languageStore.set(initialLang);
    }
    setMounted(true);
  }, []);

  const currentLanguage = supportedLanguages.find(l => l.code === currentLang) || supportedLanguages[0];

  // Filter languages by search query
  const filterLanguages = (langs: readonly typeof supportedLanguages[number][]) => {
    if (!searchQuery) return langs;
    const query = searchQuery.toLowerCase();
    return langs.filter(lang =>
      lang.name.toLowerCase().includes(query) ||
      lang.code.toLowerCase().includes(query) ||
      (lang.aliases && lang.aliases.some(alias => alias.toLowerCase().includes(query)))
    );
  };

  const mainLanguages = filterLanguages(supportedLanguages.filter(l => 'main' in l && l.main));
  const betaLanguages = filterLanguages(supportedLanguages.filter(l => 'beta' in l && l.beta));
  const otherLanguages = filterLanguages(supportedLanguages.filter(l => 'other' in l && l.other));

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
    // Dispatch event for Astro components to update
    window.dispatchEvent(new CustomEvent('languageChange', { detail: code }));
  };

  const LanguageGrid = ({ langs }: { langs: readonly typeof supportedLanguages[number][] }) => (
    <div className="grid grid-cols-2 gap-1">
      {langs.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleSelect(lang.code)}
          className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${
            currentLang === lang.code ? 'bg-accent' : ''
          }`}
        >
          <span className="mr-2">{lang.flag}</span>
          <span className="truncate">{lang.name}</span>
          {currentLang === lang.code && (
            <svg className="ml-auto h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );

  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3"
        aria-label="EN - Select language"
      >
        <span className="mr-2">🌐</span>
        <span>EN</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3"
        aria-label={`${currentLanguage.name} - Select language`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="mr-2">{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
        <svg
          className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50 max-h-96 overflow-y-auto">
            {/* Search bar */}
            <div className="px-2 py-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={translations.language?.search || 'Search languages...'}
                className="w-full px-3 py-1.5 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                data-i18n-placeholder="language.search"
              />
            </div>

            {/* Main languages */}
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground" data-i18n="language.main">
              {translations.language?.main || 'Main languages'}
            </div>
            <LanguageGrid langs={mainLanguages} />

            {/* Beta languages */}
            {betaLanguages.length > 0 && (
              <>
                <div className="my-1 h-px bg-border" />
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground" data-i18n="language.beta">
                  {translations.language?.beta || 'Languages in beta'}
                </div>
                <LanguageGrid langs={betaLanguages} />
              </>
            )}

            {/* Other languages */}
            {otherLanguages.length > 0 && (
              <>
                <div className="my-1 h-px bg-border" />
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground" data-i18n="language.other">
                  {translations.language?.other || 'Other languages'}
                </div>
                <LanguageGrid langs={otherLanguages} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
