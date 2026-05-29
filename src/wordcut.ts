import WordcutDict = require("./dict");
import WordcutCore = require("./wordcut_core");
import defaultDictWords from "./default_dict_words";
import createPathInfoBuilder from "./path_info_builder";
import createPathSelector from "./path_selector";
import createAcceptors from "./acceptors";
import latinRules = require("./latin_rules");
import thaiRules = require("./thai_rules");

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
  init(words?: string[], withDefault?: boolean, additionalWords?: string[]): void;
}

const Wordcut = Object.create(WordcutCore) as WordcutType;
Wordcut.defaultPathInfoBuilder = createPathInfoBuilder;
Wordcut.defaultPathSelector = createPathSelector;
Wordcut.defaultAcceptors = createAcceptors;
Wordcut.defaultLatinRules = latinRules;
Wordcut.defaultThaiRules = thaiRules;
Wordcut.defaultDict = WordcutDict;

Wordcut.initNoDict = function initNoDict() {
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

Wordcut.init = function init(words, withDefault, additionalWords) {
  const useDefault = withDefault !== false;
  this.initNoDict();

  const dict = Object.assign({}, this.defaultDict, { defaultWords: defaultDictWords });
  dict.init(words, useDefault, additionalWords);
  this.acceptors.creators.push(dict);
};

export = Wordcut;
