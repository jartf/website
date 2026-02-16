// Shared utilities for Now section and Now page
import { t, applyDomTranslations } from "@/i18n";

export interface PremidActivity {
  name: string;
  details?: string;
  state?: string;
  assets?: { large_image?: string; large_text?: string; small_image?: string; small_text?: string };
}

export interface LastfmTrack { type: "lastfm"; name: string; artist: string; url: string; nowplaying: boolean; image: string; date?: string; dateObj: Date }
export interface PremidData { type: "premid"; activities: PremidActivity[]; dateObj: Date }
export type LiveItem = LastfmTrack | PremidData;

export const DATE_FMT: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" };

const BADGE = '<span class="ml-2 text-sm font-bold text-red-600 dark:text-white dark:bg-red-600 px-2 py-0.5 rounded animate-pulse">Live</span>';
const SVG = {
  headphones: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  activity: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
};

// --- Fetching ---

export async function fetchLiveData(): Promise<LiveItem[]> {
  const [lfm, pre] = await Promise.all([fetch("/api/lastfm").catch(() => null), fetch("/api/premid").catch(() => null)]);
  const items: LiveItem[] = [];
  if (lfm?.ok) { const track = parseLastfm(await lfm.text()); if (track) items.push(track); }
  if (pre?.ok) { const d = await pre.json(); if (d.activities?.length) items.push({ type: "premid", activities: d.activities.map((a: any) => a.activity), dateObj: new Date() }); }
  return items;
}

function parseLastfm(xml: string): LastfmTrack | null {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const tracks = doc.getElementsByTagName("track");
  if (!tracks.length) return null;

  const track = Array.from(tracks).find(t => t.getAttribute("nowplaying") === "true") || tracks[0];
  const tag = (name: string) => track.getElementsByTagName(name)[0]?.textContent || "";
  const [name, artist] = [tag("name"), tag("artist")];
  if (!name || !artist) return null;

  const nowplaying = track.getAttribute("nowplaying") === "true";
  let date: string | undefined, dateObj = new Date();
  if (!nowplaying) {
    const uts = track.getElementsByTagName("date")[0]?.getAttribute("uts");
    if (uts) { dateObj = new Date(+uts * 1000); date = dateObj.toLocaleString("en", DATE_FMT); }
  }
  const image = Array.from(track.getElementsByTagName("image")).find(i => i.getAttribute("size") === "large")?.textContent?.trim() || "";
  return { type: "lastfm", name, artist, url: tag("url"), nowplaying, image, date, dateObj };
}

// --- Rendering ---

function activityCard({ name, details, state, assets }: PremidActivity): string {
  const img = assets?.large_image ? `<div class="relative w-12 h-12 flex-shrink-0">
    <img src="${assets.large_image}" alt="${assets.large_text || name}" class="w-12 h-12 rounded-lg" loading="lazy"/>
    ${assets.small_image ? `<img src="${assets.small_image}" alt="${assets.small_text || ""}" class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-1 border-background bg-background" loading="lazy"/>` : ""}
  </div>` : "";
  return `<div class="flex items-center gap-3 overflow-hidden">${img}<div class="flex-1 min-w-0 overflow-hidden">
    <span class="font-semibold break-words block">${name}</span>
    ${details ? `<p class="text-sm break-words">${details}</p>` : ""}
    ${state ? `<p class="text-sm text-muted-foreground break-words">${state}</p>` : ""}
  </div></div>`;
}

function liveContent(item: LiveItem): string {
  if (item.type === "lastfm") {
    return `<div class="flex items-center gap-2 font-semibold mb-1">
      ${SVG.headphones}<span class="now-category" data-i18n="now.categories.listening">${t("now.categories.listening") || "Listening"}</span>${item.nowplaying ? BADGE : ""}
    </div><div class="flex items-center gap-3 overflow-hidden py-1">
      ${item.image ? `<img src="${item.image}" alt="${item.name} cover art" class="w-12 h-12 rounded-lg flex-shrink-0" loading="lazy" decoding="async"/>` : ""}
      <div class="flex-1 min-w-0 overflow-hidden">
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="hover:underline font-semibold break-words block">${item.name}</a>
        <p class="text-sm text-muted-foreground break-words">${item.artist}</p>
      </div></div>${item.date && !item.nowplaying ? `<div class="text-xs text-muted-foreground mt-1">${item.date}</div>` : ""}`;
  }
  return `<div class="flex items-center gap-2 font-semibold mb-1">
    ${SVG.activity}<span class="now-category" data-i18n="now.categories.premid">${t("now.categories.premid") || "Discord activity"}</span>${BADGE}
  </div><div class="space-y-3">${item.activities.map(activityCard).join("")}</div>`;
}

export const renderCompact = (item: LiveItem, cls: string) =>
  `<article class="${cls}">${liveContent(item)}</article>`;

export const renderCard = (item: LiveItem) =>
  `<article class="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow"><div class="flex items-start gap-4">
    <span class="text-3xl flex-shrink-0" aria-hidden="true">${item.type === "lastfm" ? "🎧" : "📡"}</span>
    <div class="flex-1 min-w-0">${liveContent(item)}</div>
  </div></article>`;

// --- i18n ---

export function updateI18nElements(root: Element, lang: string) {
  // Delegate [data-i18n] to the shared implementation
  applyDomTranslations(root);
  // Now-specific: update multilingual content blocks
  root.querySelectorAll("[data-now-content]").forEach(article => {
    try {
      const content = JSON.parse(article.getAttribute("data-now-content")!);
      const text = article.querySelector(".now-text");
      if (text) text.textContent = content[lang] || content.en;
      const secRaw = article.getAttribute("data-now-content-secondary");
      const sub = article.querySelector(".now-subtext");
      if (secRaw && sub) { const sec = JSON.parse(secRaw); sub.textContent = sec[lang] || sec.en; }
    } catch {}
  });
}

/** Conflict map: static category → live type that replaces it */
export const CONFLICT_MAP: Record<string, string> = { listening: "lastfm", premid: "premid" };
