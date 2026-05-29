/**
 * Async entry point for thai-cut-browser.
 *
 * This module does NOT statically reference `default_dict_words.ts`,
 * `wordcut.ts`, or `index.ts` for runtime values, ensuring tree-shaking
 * removes the embedded dictionary when only this entry is imported.
 */

import { buildAsyncWordcut, buildAsyncWordcutNoDict } from "./wordcut_async";
import { validateWordArray } from "./validate";
import { sortuniq } from "./sort_utils";
import type { WordcutInstance } from "./index_types";

// ─── Public types ────────────────────────────────────────────────────────────

export type DictionarySource =
  | string[]
  | Promise<string[]>
  | (() => Promise<string[]>);

export interface CreateWordcutAsyncOptions {
  /** One of: string[], Promise<string[]>, or () => Promise<string[]>. Required unless noDict is true. */
  dictionarySource?: DictionarySource;
  /** Optional extra words merged into the dictionary after the source resolves. */
  additionalWords?: string[];
  /** If true, build a dict-free instance and ignore dictionarySource. Mutually exclusive with dictionarySource. */
  noDict?: boolean;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function wrapCause(original: unknown): Error {
  if (original === undefined || original === null) {
    return new Error("failed to load dictionary", {
      cause: new Error("Dictionary_Source rejected without a reason"),
    });
  }
  return new Error("failed to load dictionary", { cause: original });
}

// ─── Main factory ────────────────────────────────────────────────────────────

export function createWordcutAsync(
  options: CreateWordcutAsyncOptions = {}
): Promise<WordcutInstance> {
  // Defensive: treat null/non-object as empty options so the
  // "neither provided" branch produces a rejected promise rather
  // than a synchronous throw.
  if (options === null || typeof options !== "object") {
    options = {};
  }

  // --- Validate options shape ---

  const hasDictionarySource = options.dictionarySource !== undefined;
  const hasNoDict = options.noDict === true;

  // Reject when both provided (Req 2.10)
  if (hasDictionarySource && hasNoDict) {
    return Promise.reject(
      new Error(
        "dictionarySource and noDict: true are mutually exclusive"
      )
    );
  }

  // Reject when neither provided (Req 2.9 / 7.4)
  if (!hasDictionarySource && !hasNoDict) {
    return Promise.reject(
      new Error(
        "exactly one of dictionarySource or noDict: true must be provided"
      )
    );
  }

  // --- noDict path (Req 2.6) ---
  if (hasNoDict) {
    if (options.additionalWords !== undefined) {
      return Promise.reject(
        new Error(
          "additionalWords cannot be used with noDict: true"
        )
      );
    }
    return Promise.resolve(buildAsyncWordcutNoDict());
  }

  // --- Validate additionalWords before invoking the source ---
  if (options.additionalWords !== undefined) {
    try {
      validateWordArray("additionalWords", options.additionalWords);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // --- Normalize dictionarySource ---
  const source = options.dictionarySource!;
  let wordsPromise: Promise<string[]>;

  if (Array.isArray(source)) {
    // string[] → resolved synchronously
    wordsPromise = Promise.resolve(source);
  } else if (typeof source === "function") {
    // function → invoked exactly once synchronously inside this call (Req 7.2)
    try {
      const result = source();
      wordsPromise = Promise.resolve(result);
    } catch (err: unknown) {
      return Promise.reject(wrapCause(err));
    }
  } else {
    // Promise<string[]> → awaited
    wordsPromise = Promise.resolve(source);
  }

  // --- Resolve, validate, merge, build ---
  return wordsPromise.then(
    (resolvedWords) => {
      // Validate resolved words (Req 2.7)
      validateWordArray("dictionarySource", resolvedWords);

      // Merge with additionalWords and deduplicate
      let merged: string[];
      if (options.additionalWords !== undefined && options.additionalWords.length > 0) {
        merged = sortuniq(resolvedWords.concat(options.additionalWords));
      } else {
        merged = sortuniq(resolvedWords);
      }

      // Build the instance
      return buildAsyncWordcut(merged);
    },
    (err: unknown) => {
      throw wrapCause(err);
    }
  );
}

// ─── Re-exports ──────────────────────────────────────────────────────────────

export { parseDictionary, serializeDictionary } from "./dict_format";
export { getDefaultDictPath } from "./dict_path";
export type { WordcutInstance };
