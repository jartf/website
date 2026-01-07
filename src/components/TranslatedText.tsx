import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { languageStore, t } from '@/i18n';

interface TranslatedTextProps {
  i18nKey: string;
  fallback?: string;
  params?: Record<string, string | number>;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function TranslatedText({
  i18nKey,
  fallback,
  params,
  as: Component = 'span',
  className
}: TranslatedTextProps) {
  const lang = useStore(languageStore);
  const [text, setText] = useState(fallback || i18nKey);

  useEffect(() => {
    const translated = t(i18nKey, params);
    setText(translated !== i18nKey ? translated : (fallback || i18nKey));
  }, [lang, i18nKey, fallback, params]);

  return <Component className={className}>{text}</Component>;
}

// Simpler hook for use in other components
export function useT() {
  const lang = useStore(languageStore);

  return (key: string, params?: Record<string, string | number>) => {
    return t(key, params);
  };
}
