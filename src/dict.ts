import { createPrefixTree } from "./prefixtree";
import type { Acceptor } from "./acceptors";
import defaultDictWords from "./default_dict_words";

type DictAcceptor = Acceptor & {
  nodeId: number;
  dict: typeof WordcutDict;
};

const WordcutDict = {
  dict: [] as string[],
  tree: createPrefixTree<string | null>([]),

  init(words?: string[], withDefault = true, additionalWords?: string[]) {
    if (words !== undefined && !Array.isArray(words)) {
      throw new Error("words must be a string[]");
    }

    this.dict = [];

    if (words !== undefined) {
      this.addWords(words, false);
    }

    if (withDefault) {
      this.addWords(Array.from(defaultDictWords), false);
    }

    if (additionalWords !== undefined) {
      if (!Array.isArray(additionalWords)) {
        throw new Error("additionalWords must be a string[]");
      }
      this.addWords(additionalWords, false);
    }

    this.finalizeDict();
  },

  addWords(words: string[], finalize?: boolean) {
    finalize = finalize === undefined || finalize;
    this.dict.push(...words);
    if (finalize) {
      this.finalizeDict();
    }
  },

  finalizeDict() {
    this.dict = this.sortuniq(this.dict);
    this.tree = createPrefixTree(this.dict.map((w) => [w, null] as [string, null]));
  },

  createAcceptor(): DictAcceptor {
    const dict = this;
    return {
      nodeId: 0,
      strOffset: 0,
      isFinal: false,
      isError: false,
      tag: "DICT",
      w: 1,
      type: "DICT",
      dict,
      transit(ch: string) {
        return this.dict.transit(this, ch);
      }
    };
  },

  transit(acceptor: DictAcceptor, ch: string): DictAcceptor {
    const child = this.tree.lookup(acceptor.nodeId, acceptor.strOffset, ch);

    if (child !== null) {
      const [nodeId, isFinal] = child;
      acceptor.nodeId = nodeId;
      acceptor.strOffset++;
      acceptor.isFinal = isFinal;
    } else {
      acceptor.isError = true;
    }

    return acceptor;
  },

  sortuniq(a: string[]) {
    return a.sort().filter((item, pos, arr) => !pos || item !== arr[pos - 1]);
  },
};

export = WordcutDict;
