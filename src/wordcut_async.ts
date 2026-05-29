import WordcutCore = require("./wordcut_core");
import WordcutDict = require("./dict");
import createPathInfoBuilder from "./path_info_builder";
import createPathSelector from "./path_selector";
import createAcceptors from "./acceptors";
import latinRules = require("./latin_rules");
import thaiRules = require("./thai_rules");
import type { WordcutInstance } from "./index_types";

interface WordcutType {
  defaultPathInfoBuilder: typeof createPathInfoBuilder;
  defaultPathSelector: typeof createPathSelector;
  defaultAcceptors: typeof createAcceptors;
  defaultLatinRules: typeof latinRules;
  defaultThaiRules: typeof thaiRules;
  defaultDict: typeof WordcutDict;
  pathInfoBuilder: ReturnType<typeof createPathInfoBuilder>;
  pathSelector: ReturnType<typeof createPathSelector>;
  acceptors: ReturnType<typeof createAcceptors>;
  initNoDict(): void;
}

function createBaseInstance(): WordcutType {
  const instance = Object.create(WordcutCore) as WordcutType;
  instance.defaultPathInfoBuilder = createPathInfoBuilder;
  instance.defaultPathSelector = createPathSelector;
  instance.defaultAcceptors = createAcceptors;
  instance.defaultLatinRules = latinRules;
  instance.defaultThaiRules = thaiRules;
  instance.defaultDict = WordcutDict;

  instance.initNoDict = function initNoDict() {
    this.pathInfoBuilder = this.defaultPathInfoBuilder();
    this.pathSelector = this.defaultPathSelector();
    this.acceptors = this.defaultAcceptors();

    this.defaultLatinRules.forEach((rule) => {
      this.acceptors.creators.push(rule);
    });

    this.defaultThaiRules.forEach((rule) => {
      this.acceptors.creators.push(rule);
    });
  };

  instance.initNoDict();
  return instance;
}

export function buildAsyncWordcutNoDict(): WordcutInstance {
  return createBaseInstance() as unknown as WordcutInstance;
}

export function buildAsyncWordcut(words: string[]): WordcutInstance {
  const instance = createBaseInstance();

  // Create a fresh dict copy — defaultWords is left undefined so the
  // embedded default_dict_words module is never referenced from this path.
  const dict = Object.assign({}, WordcutDict);
  dict.init(words, false, undefined);
  instance.acceptors.creators.push(dict);

  return instance as unknown as WordcutInstance;
}
