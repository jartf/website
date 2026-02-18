/** Resolve a dot-separated key path to a string value in a nested object. */
export function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  let cur: any = obj;
  for (const k of path.split(".")) {
    if (cur && typeof cur === "object" && k in cur) cur = cur[k];
    else return undefined;
  }
  return typeof cur === "string" ? cur : undefined;
}
