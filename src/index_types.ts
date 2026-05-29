/**
 * Type-only re-export shim.
 *
 * This file exists so that `src/async.ts` can reference the WordcutInstance
 * type without creating a runtime dependency on `src/index.ts`. TypeScript
 * erases `export type` at compile time, so importing from this module
 * produces zero runtime code.
 */
export type { WordcutInstance } from "./index";
