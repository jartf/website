import type { APIRoute } from "astro";
import { preMidConfig } from "@/lib/constants";

export const prerender = false;

interface Activity {
  name: string;
  details?: string;
  state?: string;
  timestamps?: { start?: number; end?: number };
  buttons?: { label: string; url: string }[];
  assets?: { large_image?: string; small_image?: string };
}

interface ActivityEntry {
  activity: Activity;
  lastUpdate: number;
  timeoutId: ReturnType<typeof setTimeout> | null;
}

const activities = new Map<string, ActivityEntry>();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

const isValidUrl = (url: string): boolean => {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const getActivityKey = (activity: Activity): string =>
  JSON.stringify({ name: activity.name, details: activity.details ?? "", state: activity.state ?? "" });

const getActivityScore = (activity: Activity): number =>
  (activity.timestamps?.start ? 2 : 0) +
  (activity.timestamps?.end ? 2 : 0) +
  (activity.buttons?.length ?? 0) * 3 +
  (activity.assets?.large_image ? 1 : 0) +
  (activity.assets?.small_image ? 1 : 0);

const validateActivity = (activity: any): activity is Activity => {
  if (!activity || typeof activity !== "object" || typeof activity.name !== "string" || !activity.name.trim() || activity.name.length > 128)
    return false;
  if (activity.details !== undefined && (typeof activity.details !== "string" || activity.details.length > 128)) return false;
  if (activity.state !== undefined && (typeof activity.state !== "string" || activity.state.length > 128)) return false;
  if (
    activity.timestamps &&
    (typeof activity.timestamps !== "object" ||
      (activity.timestamps.start !== undefined && typeof activity.timestamps.start !== "number") ||
      (activity.timestamps.end !== undefined && typeof activity.timestamps.end !== "number"))
  )
    return false;
  if (activity.buttons !== undefined) {
    if (!Array.isArray(activity.buttons) || activity.buttons.length > 2) return false;
    for (const b of activity.buttons) {
      if (
        !b ||
        typeof b !== "object" ||
        typeof b.label !== "string" ||
        typeof b.url !== "string" ||
        !b.label ||
        b.label.length > 32 ||
        b.url.length > 512 ||
        !isValidUrl(b.url)
      )
        return false;
    }
  }
  if (
    activity.assets &&
    (typeof activity.assets !== "object" ||
      (activity.assets.large_image !== undefined && (typeof activity.assets.large_image !== "string" || activity.assets.large_image.length > 256)) ||
      (activity.assets.small_image !== undefined && (typeof activity.assets.small_image !== "string" || activity.assets.small_image.length > 256)))
  )
    return false;
  return true;
};

const validateExtension = (extension: any): boolean =>
  extension && typeof extension === "object" && typeof extension.user_id === "string" && extension.user_id.length > 0;

const cleanupExpiredActivities = (): void => {
  const now = Date.now();
  for (const [key, entry] of activities.entries()) {
    if (now - entry.lastUpdate >= preMidConfig.activityTimeoutMs) {
      entry.timeoutId && clearTimeout(entry.timeoutId);
      activities.delete(key);
    }
  }
};

const createActivityTimeout = (key: string): ReturnType<typeof setTimeout> =>
  setTimeout(() => activities.delete(key), preMidConfig.activityTimeoutMs);

async function fetchJsonWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { status: 200, headers: { ...CORS_HEADERS } });
};

export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400, headers: { ...CORS_HEADERS } });
  }

  const { active_activity, extension } = body ?? {};

  if (!validateExtension(extension)) {
    return Response.json({ error: "Invalid or missing extension data" }, { status: 400, headers: { ...CORS_HEADERS } });
  }

  if (extension.user_id !== preMidConfig.authorizedUserId) {
    return Response.json({ error: "Unauthorized" }, { status: 403, headers: { ...CORS_HEADERS } });
  }

  if (active_activity !== undefined && active_activity !== null) {
    if (!validateActivity(active_activity)) {
      return Response.json({ error: "Invalid activity data" }, { status: 400, headers: { ...CORS_HEADERS } });
    }

    if (activities.size >= preMidConfig.maxActivities) {
      cleanupExpiredActivities();
      if (activities.size >= preMidConfig.maxActivities) {
        const [oldestKey, oldestEntry] = Array.from(activities.entries()).reduce((oldest, current) =>
          current[1].lastUpdate < oldest[1].lastUpdate ? current : oldest
        );
        oldestEntry.timeoutId && clearTimeout(oldestEntry.timeoutId);
        activities.delete(oldestKey);
      }
    }

    const key = getActivityKey(active_activity);
    const now = Date.now();
    const existing = activities.get(key);
    const shouldUpdate = !existing || getActivityScore(active_activity) >= getActivityScore(existing.activity);

    if (shouldUpdate) {
      existing?.timeoutId && clearTimeout(existing.timeoutId);
      activities.set(key, { activity: active_activity, lastUpdate: now, timeoutId: createActivityTimeout(key) });
    } else if (existing) {
      existing.lastUpdate = now;
      existing.timeoutId && clearTimeout(existing.timeoutId);
      existing.timeoutId = createActivityTimeout(key);
    }
  } else {
    cleanupExpiredActivities();
    const now = Date.now();
    const hasRecentActivity = Array.from(activities.values()).some((entry) => now - entry.lastUpdate < preMidConfig.clearThresholdMs);
    if (!hasRecentActivity) {
      for (const entry of activities.values()) entry.timeoutId && clearTimeout(entry.timeoutId);
      activities.clear();
    }
  }

  return Response.json({ success: true }, { status: 200, headers: { ...CORS_HEADERS } });
};

export const GET: APIRoute = async ({ request }) => {
  const host = request.headers.get("host") ?? "";
  const isProduction = preMidConfig.productionHosts.has(host);

  if (!isProduction) {
    try {
      const response = await fetchJsonWithTimeout(preMidConfig.productionApiUrl, preMidConfig.apiTimeoutMs);
      if (!response.ok) throw new Error(`API returned ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return Response.json(data, { status: 200, headers: { ...CORS_HEADERS } });
    } catch (error) {
      console.error("Serving local data, failed to fetch from PreMID API:", {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        host,
      });
    }
  }

  cleanupExpiredActivities();
  const now = Date.now();
  const activeActivities = Array.from(activities.values())
    .filter(({ activity }) => !activity.timestamps?.end || activity.timestamps.end > now)
    .map(({ activity, lastUpdate }) => ({ activity, lastUpdate }));

  return Response.json(
    { activities: activeActivities, count: activeActivities.length },
    { status: 200, headers: { ...CORS_HEADERS } }
  );
};
