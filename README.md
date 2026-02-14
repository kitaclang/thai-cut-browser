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
