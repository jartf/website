// Shared utilities for Now section and Now page
import { t } from "@/i18n/client";
import { formatDate, dateFull } from "@/lib/timezone-utils";

export interface PremidActivity {
  name: string;
  details?: string;
  state?: string;
  assets?: { large_image?: string; large_text?: string; small_image?: string; small_text?: string };
}

export interface LastfmTrack { type: "lastfm"; name: string; artist: string; url: string; nowplaying: boolean; image: string; date?: string; dateObj: Date }
export interface PremidData { type: "premid"; activities: PremidActivity[]; dateObj: Date }
export type LiveItem = LastfmTrack | PremidData;

const BADGE = '<span class="ml-2 text-sm font-bold text-red-600 dark:text-white dark:bg-red-600 px-2 py-0.5 rounded">Live</span>';

/** Escape HTML special characters to prevent XSS from external API data */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Sanitize a URL — only allow http(s) schemes */
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.href;
  } catch {}
  return '';
}

// --- Fetching ---

export async function fetchLiveData(): Promise<LiveItem[]> {
  const [lfm, pre] = await Promise.all([fetch("/api/lastfm").catch(() => null), fetch("/api/premid").catch(() => null)]);
  const items: LiveItem[] = [];
  if (lfm?.ok) { const track = parseLastfm(await lfm.text()); if (track) items.push(track); }
  if (pre?.ok) {
    const data = await pre.json();
    if (data.activities?.length) items.push({ type: "premid", activities: data.activities.map((a: any) => a.activity), dateObj: new Date() });
  }
  return items;
}

function parseLastfm(xml: string): LastfmTrack | null {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) return null;
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
    if (uts) { dateObj = new Date(+uts * 1000); date = formatDate(dateObj, "en", dateFull); }
  }
  const image = Array.from(track.getElementsByTagName("image")).find(i => i.getAttribute("size") === "large")?.textContent?.trim() || "";
  return { type: "lastfm", name, artist, url: tag("url"), nowplaying, image, date, dateObj };
}

// --- Rendering ---

function activityCard({ name, details, state, assets }: PremidActivity): string {
  const safeName = escapeHtml(name);
  const safeDetails = details ? escapeHtml(details) : '';
  const safeState = state ? escapeHtml(state) : '';
  const safeLargeAlt = escapeHtml(assets?.large_text || name);
  const safeSmallAlt = escapeHtml(assets?.small_text || '');
  const largeSrc = assets?.large_image ? sanitizeUrl(assets.large_image) : '';
  const smallSrc = assets?.small_image ? sanitizeUrl(assets.small_image) : '';
  const img = largeSrc ? `<div class="relative w-12 h-12 flex-shrink-0">
    <img src="${largeSrc}" alt="${safeLargeAlt}" class="w-12 h-12 rounded-lg" loading="lazy"/>
    ${smallSrc ? `<img src="${smallSrc}" alt="${safeSmallAlt}" class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-1 border-background bg-background" loading="lazy"/>` : ''}
  </div>` : '';
  return `<div class="flex items-center gap-3 overflow-hidden">${img}<div class="flex-1 min-w-0 overflow-hidden">
    <span class="font-semibold break-words block">${safeName}</span>
    ${safeDetails ? `<p class="text-sm break-words">${safeDetails}</p>` : ''}
    ${safeState ? `<p class="text-sm text-muted-foreground break-words">${safeState}</p>` : ''}
  </div></div>`;
}

function liveContent(item: LiveItem, includeIcon = true): string {
  if (item.type === "lastfm") {
    const imageSrc = item.image ? sanitizeUrl(item.image) : "";
    const trackUrl = sanitizeUrl(item.url);
    return `<div class="flex items-center gap-2 font-semibold mb-1">
      ${includeIcon ? '<span class="text-lg" aria-hidden="true">🎧</span>' : ''}<span class="now-category">${t("now.categories.listening") || "Listening"}</span>${item.nowplaying ? BADGE : ""}
    </div><div class="flex items-center gap-3 overflow-hidden py-1">
      ${imageSrc ? `<img src="${imageSrc}" alt="${escapeHtml(item.name)} cover art" class="w-12 h-12 rounded-lg flex-shrink-0" loading="lazy" decoding="async"/>` : ''}
      <div class="flex-1 min-w-0 overflow-hidden">
        ${trackUrl
          ? `<a href="${trackUrl}" target="_blank" rel="noopener noreferrer" class="hover:underline font-semibold break-words block">${escapeHtml(item.name)}</a>`
          : `<span class="font-semibold break-words block">${escapeHtml(item.name)}</span>`}
        <p class="text-sm text-muted-foreground break-words">${escapeHtml(item.artist)}</p>
      </div></div>${item.date && !item.nowplaying ? `<time data-date="${item.dateObj.toISOString()}" class="text-xs text-muted-foreground mt-1 block">${item.date}</time>` : ""}`;
  }
  return `<div class="flex items-center gap-2 font-semibold mb-1">
    ${includeIcon ? '<span class="text-lg" aria-hidden="true">🎮</span>' : ''}<span class="now-category">${t("now.categories.premid") || "Discord activity"}</span>${BADGE}
  </div><div class="space-y-3">${item.activities.map(activityCard).join("")}</div>`;
}

export const renderCompact = (item: LiveItem, cls: string) =>
  `<article class="${cls}">${liveContent(item, true)}</article>`;

export const renderCard = (item: LiveItem) =>
  `<article class="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow"><div class="flex items-start gap-4">
    <span class="text-3xl flex-shrink-0" aria-hidden="true">${item.type === "lastfm" ? "🎧" : "📡"}</span>
    <div class="flex-1 min-w-0">${liveContent(item, false)}</div>
  </div></article>`;

// --- i18n ---

export function updateI18nElements(root: Element, lang: string) {
  // Update multilingual content blocks injected by live data
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
