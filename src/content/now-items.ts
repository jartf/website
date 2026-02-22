// Now items types
export type NowItemContent = Record<'en' | 'vi' | 'ru' | 'et' | 'da' | 'tr' | 'zh' | 'pl' | 'sv' | 'fi' | 'tok' | 'vi-Hani', string>;

export type NowItemContentOptional = Partial<NowItemContent> & { en: string };

export type NowItem = {
  id: number;
  category: string;
  icon: string; // Icon name from lucide
  image?: string; // Optional image URL (e.g., cover art for listening)
  content: NowItemContent;
  contentSecondary?: NowItemContentOptional; // Optional second line (e.g., artist)
  date: string;
};

// Helper to get localized content
export function getNowItemContent(item: NowItem, lang: string): string {
  return item.content[lang as keyof NowItemContent] || item.content.en;
}
