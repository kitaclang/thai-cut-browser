thai-cut-browser
=======

TypeScript-first fork of wordcut: Thai word segmentation library optimized for frontend Node.js projects.


Installation
------------

```
npm install thai-cut-browser
```

Requirements
------------

- Node.js 20 / 22 / >=24


Usage (Library)
---------------

### TypeScript (ESM)

For modern projects (using `"type": "module"` in `package.json` and `moduleResolution: "bundler"` or `"nodenext"`):

```ts
import { createWordcut, cut, type WordcutInstance } from "thai-cut-browser";

const wordcut: WordcutInstance = createWordcut();
const segmented: string = wordcut.cut("ฉันชอบกินข้าว");
const quick: string = cut("กากา");
```

### TypeScript with custom dictionary:

```ts
import { createWordcut, type WordcutInstance } from "thai-cut-browser";

const wordcut: WordcutInstance = createWordcut({
  dictionaryWords: ["กินข้าว", "อร่อยมากมาก"],
  withDefaultDict: true,
  additionalWords: ["ชอบกิน", "ข้าวอร่อยมากมาก"]
});

const segmented: string[] = wordcut.cutIntoArray("ฉันชอบกินข้าวอร่อยมากมาก");
```

### Javascript (CommonJS)

```javascript
const { createWordcut, cut } = require("thai-cut-browser");

const wordcut = createWordcut();
const segmented = wordcut.cut("ฉันชอบกินข้าว");
const quick = cut("กากา");
```

### Javascript with custom dictionary:

```javascript
const { createWordcut } = require("thai-cut-browser");

const wordcut = createWordcut({
  dictionaryWords: ["กินข้าว", "อร่อยมากมาก"],
  withDefaultDict: true,
  additionalWords: ["ชอบกิน", "ข้าวอร่อยมากมาก"]
});

const segmented = wordcut.cutIntoArray("ฉันชอบกินข้าวอร่อยมากมาก");
```


Asynchronous API
----------------

The package provides an async entry point at `thai-cut-browser/async` that lets you initialize a segmentation instance from a dictionary fetched at runtime. This keeps the 500 KB+ embedded dictionary out of your main JavaScript chunk — the dictionary is loaded on demand and can be cached independently by your CDN or service worker.

```ts
import { createWordcutAsync } from "thai-cut-browser/async";
```

`createWordcutAsync(options)` returns a `Promise<WordcutInstance>`. The resolved instance exposes the same `cut`, `cutIntoArray`, and `cutIntoRanges` methods as the synchronous API and produces identical segmentation results for the same dictionary and input.

### Options (`CreateWordcutAsyncOptions`)

| Field | Type | Description |
|---|---|---|
| `dictionarySource` | `DictionarySource` | The words to load. Required unless `noDict` is `true`. |
| `additionalWords` | `string[]` | Optional extra words merged into the dictionary after the source resolves. |
| `noDict` | `boolean` | If `true`, build a dictionary-free instance. Mutually exclusive with `dictionarySource`. |

### `DictionarySource` variants

The `dictionarySource` field accepts three forms:

- **`string[]`** — a pre-loaded array of words. Useful when you already have the dictionary in memory.
- **`Promise<string[]>`** — a promise that resolves to the word array. Ideal for wrapping a `fetch` call.
- **`() => Promise<string[]>`** — a factory function returning a promise. Invoked exactly once, synchronously within the `createWordcutAsync` call. Use this when you want lazy evaluation (the fetch only happens when segmentation is actually needed).

### Error handling

`createWordcutAsync` rejects the returned promise in the following cases:

- **Missing options** — if neither `dictionarySource` nor `noDict: true` is provided, the promise rejects with an error indicating that exactly one must be supplied.
- **Mutually exclusive options** — if both `dictionarySource` and `noDict: true` are provided, the promise rejects with an error indicating they are mutually exclusive.
- **Invalid word arrays** — if the resolved `dictionarySource` or `additionalWords` is not an array of strings (or exceeds 1,000,000 elements), the promise rejects with a `TypeError` whose message identifies the offending option name, the zero-based index of the first non-string element, and its `typeof` result.
- **Source failures** — if a `dictionarySource` function throws synchronously or its returned promise rejects, the promise rejects with an error whose `cause` property is the original thrown/rejected value. When the original value is `undefined` or `null`, `cause` is set to an `Error` indicating the source rejected without a reason.

### Example: fetching the dictionary asset with `fetch`

```ts
import { createWordcutAsync, parseDictionary } from "thai-cut-browser/async";
// Bundlers resolve this subpath to a hashed asset URL at build time
import dictUrl from "thai-cut-browser/default-dict.txt";

// Browser / bundler usage — fetch the dictionary asset at runtime
const wordcut = await createWordcutAsync({
  dictionarySource: async () => {
    const res = await fetch(dictUrl);
    if (!res.ok) throw new Error(`Failed to fetch dictionary: ${res.status}`);
    const text = await res.text();
    return parseDictionary(text);
  },
  additionalWords: ["กินข้าว"],
});

const result = wordcut.cut("ฉันชอบกินข้าว");
```

### Resolving the dictionary asset path

The package ships the default dictionary as a static file at `assets/default-dict.txt` inside the installed package. How you reference it depends on your environment:

**Node.js (server-side, SSR, scripts):** Call `getDefaultDictPath()` to get the absolute file path of the asset. It uses Node's `require.resolve` under the hood and throws if the asset cannot be located.

```ts
import { getDefaultDictPath, parseDictionary } from "thai-cut-browser/async";
import { readFileSync } from "node:fs";

const dictPath = getDefaultDictPath();
const words = parseDictionary(readFileSync(dictPath, "utf8"));
```

**Bundlers (Vite, webpack, Rollup):** Import the asset via the package subpath `thai-cut-browser/default-dict.txt`. Most bundlers resolve this to a hashed URL you can pass to `fetch`:

```ts
import dictUrl from "thai-cut-browser/default-dict.txt";
// dictUrl is a string like "/assets/default-dict-abc123.txt" after bundling
```

The exact import syntax depends on your bundler's asset handling (Vite resolves it automatically; webpack may need the `asset/resource` rule or a `?url` suffix).

### Utility exports

The async entry also re-exports two utility functions for working with the dictionary file format:

- **`parseDictionary(text: string): string[]`** — parses a UTF-8 dictionary asset (one word per line, LF or CRLF terminated) into an array of words. Empty lines are skipped.
- **`serializeDictionary(words: string[]): string`** — converts a word array into the dictionary asset format (LF-terminated lines). Throws if any element is not a string or contains line terminators.


Development
-----------

```bash
npm run build
npm test
```

Project layout:

- `src/` = TypeScript source files
- `lib/` = Generated JavaScript and `.d.ts` files

Notes:

- Runtime dictionary loading from filesystem/glob (`dictPath`) has been removed.
- Use `dictionaryWords: string[]` for custom dictionaries.

Forked from "wordcut (https://github.com/veer66/wordcut)"
