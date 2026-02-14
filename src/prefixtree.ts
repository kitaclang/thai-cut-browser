export type PrefixTreeChild<T = unknown> = [number, boolean, T | null];

export interface PrefixTree<T = unknown> {
  tab: Record<string, PrefixTreeChild<T>>;
  lookup(nodeId: number, offset: number, ch: string): PrefixTreeChild<T> | null;
}

export function createPrefixTree<T = unknown>(
  wordPayloads: Array<[string, T]> | null | undefined
): PrefixTree<T> {
  const tab: Record<string, PrefixTreeChild<T>> = {};

  if (wordPayloads) {
    wordPayloads.forEach(([word, payload], i) => {
      let rowNo = 0;
      for (let j = 0; j < word.length; j++) {
        const ch = word[j];
        const key = String([rowNo, j, ch]);
        const child = tab[key];

        if (child) {
          rowNo = child[0];
        } else {
          const isFinal = j + 1 === word.length;
          tab[key] = [i, isFinal, isFinal ? payload : null];
          rowNo = i;
        }
      }
    });
  }

  return {
    tab,
    lookup(nodeId: number, offset: number, ch: string): PrefixTreeChild<T> | null {
      const child = this.tab[String([nodeId, offset, ch])];
      return child ?? null;
    }
  };
}
