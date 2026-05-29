/**
 * Shared sort-and-deduplicate utility.
 * Matches the semantics used in dict.ts at runtime.
 */
export function sortuniq(a: string[]): string[] {
  return a.slice().sort().filter((item, pos, arr) => !pos || item !== arr[pos - 1]);
}
