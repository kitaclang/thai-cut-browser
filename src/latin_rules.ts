import type { Acceptor, AcceptorCreator } from "./acceptors";

type TagMap = Record<string, Acceptor>;

const WordRule: AcceptorCreator = {
  createAcceptor(tag: TagMap): Acceptor | null {
    if (tag.WORD_RULE) return null;

    return {
      strOffset: 0,
      isFinal: false,
      isError: false,
      tag: "WORD_RULE",
      type: "WORD_RULE",
      w: 1,
      transit(ch: string) {
        const lch = ch.toLowerCase();
        if (lch >= "a" && lch <= "z") {
          this.isFinal = true;
          this.strOffset++;
        } else {
          this.isError = true;
        }
        return this;
      }
    };
  }
};

const NumberRule: AcceptorCreator = {
  createAcceptor(tag: TagMap): Acceptor | null {
    if (tag.NUMBER_RULE) return null;

    return {
      strOffset: 0,
      isFinal: false,
      isError: false,
      tag: "NUMBER_RULE",
      type: "NUMBER_RULE",
      w: 1,
      transit(ch: string) {
        if (ch >= "0" && ch <= "9") {
          this.isFinal = true;
          this.strOffset++;
        } else {
          this.isError = true;
        }
        return this;
      }
    };
  }
};

const SpaceRule: AcceptorCreator = {
  createAcceptor(tag: TagMap): Acceptor | null {
    if (tag.SPACE_RULE) return null;

    return {
      strOffset: 0,
      isFinal: false,
      isError: false,
      tag: "SPACE_RULE",
      type: "SPACE_RULE",
      w: 1,
      transit(ch: string) {
        if (ch === " " || ch === "\t" || ch === "\r" || ch === "\n" || ch === "\u00A0" || ch === "\u2003") {
          this.isFinal = true;
          this.strOffset++;
        } else {
          this.isError = true;
        }
        return this;
      }
    };
  }
};

const SingleSymbolRule: AcceptorCreator = {
  createAcceptor(): Acceptor {
    return {
      strOffset: 0,
      isFinal: false,
      isError: false,
      tag: "SINSYM",
      type: "SINSYM",
      w: 1,
      transit(ch: string) {
        if (this.strOffset === 0 && ch.match(/^[\@\(\)\/\,\-\.\?"`]$/)) {
          this.isFinal = true;
          this.strOffset++;
        } else {
          this.isError = true;
        }
        return this;
      }
    };
  }
};

const LatinRules: AcceptorCreator[] = [WordRule, SpaceRule, SingleSymbolRule, NumberRule];

export = LatinRules;
