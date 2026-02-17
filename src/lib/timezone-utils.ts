// Timezone anchor utility
// Returns a timeZone option to spread into Intl.DateTimeFormat / toLocaleDateString options
import { authorTimezone } from "./constants";

export function getTimezoneOption(): { timeZone: string } | Record<string, never> {
  if (typeof localStorage === "undefined") return {};
  return localStorage.getItem("timezone-anchor") === "author"
    ? { timeZone: authorTimezone }
    : {};
}
