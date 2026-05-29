import BaseWordcut = require("./wordcut");
import { validateWordArray } from "./validate";

export interface WordcutInstance {
  initNoDict(): void;
  init(words?: string[], withDefault?: boolean, additionalWords?: string[]): void;
  cut(text: string, delimiter?: string): string;
  cutIntoArray(text: string): string[];
  cutIntoRanges(text: string, noText?: boolean): Array<{ s: number; e: number; text?: string }>;
}

export interface CreateWordcutOptions {
  dictionaryWords?: string[];
  withDefaultDict?: boolean;
  additionalWords?: string[];
  noDict?: boolean;
  dictPath?: string | string[];
}

function createInstance(): WordcutInstance {
  return Object.create(BaseWordcut) as WordcutInstance;
}

export function createWordcut(options: CreateWordcutOptions = {}): WordcutInstance {
  const instance = createInstance();

  // dictPath rejection must come first regardless of other option values (Req 1.4)
  if (options.dictPath !== undefined) {
    throw new Error(
      "dictPath is no longer supported. Pass dictionaryWords: string[] instead."
    );
  }

  // Validate word arrays before any initialization (Req 1.5)
  if (options.dictionaryWords !== undefined) {
    validateWordArray("dictionaryWords", options.dictionaryWords);
  }
  if (options.additionalWords !== undefined) {
    validateWordArray("additionalWords", options.additionalWords);
  }

  if (options.noDict) {
    if (options.additionalWords !== undefined) {
      throw new Error("additionalWords cannot be used with noDict: true");
    }
    instance.initNoDict();
    return instance;
  }

  instance.init(options.dictionaryWords, options.withDefaultDict, options.additionalWords);
  return instance;
}

let defaultInstance: WordcutInstance | null = null;

function getDefaultInstance(): WordcutInstance {
  if (defaultInstance === null) {
    defaultInstance = createWordcut();
  }
  return defaultInstance;
}

export function cut(text: string, delimiter?: string): string {
  return getDefaultInstance().cut(text, delimiter);
}

export function cutIntoArray(text: string): string[] {
  return getDefaultInstance().cutIntoArray(text);
}

export function cutIntoRanges(
  text: string,
  noText?: boolean
): Array<{ s: number; e: number; text?: string }> {
  return getDefaultInstance().cutIntoRanges(text, noText);
}

export default createWordcut;
