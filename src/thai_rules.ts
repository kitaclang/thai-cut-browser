import type { Acceptor, AcceptorCreator } from "./acceptors";

function isMatch(pat: string, offset: number, ch: string): boolean {
  if (pat.length <= offset) return false;
  const expected = pat[offset];
  return (
    expected === ch ||
    (!!expected.match(/[กข]/) && !!ch.match(/[ก-ฮ]/)) ||
    (!!expected.match(/[มบ]/) && !!ch.match(/[ก-ฮ]/)) ||
    (!!expected.match(/\u0E49/) && !!ch.match(/[\u0E48-\u0E4B]/))
  );
}

const Rule0: AcceptorCreator = {
  createAcceptor(): Acceptor {
    const pat = "เหก็ม";
    return {
      strOffset: 0,
      isFinal: false,
      isError: false,
      tag: "THAI_RULE",
      type: "THAI_RULE",
      w: 1,
      transit(ch: string) {
        if (isMatch(pat, this.strOffset, ch)) {
          this.isFinal = this.strOffset + 1 === pat.length;
          this.strOffset++;
        } else {
          this.isError = true;
        }
        return this;
      }
    };
  }
};

const PartRule: AcceptorCreator = {
  createAcceptor(): Acceptor {
    return {
      strOffset: 0,
      isFinal: false,
      isError: false,
      tag: "PART",
      type: "PART",
      unk: 1,
      w: 1,
      patterns: ["แก", "เก", "ก้", "กก์", "กา", "กี", "กิ", "กืก"],
      transit(ch: string) {
        const offset = this.strOffset;
        this.patterns = this.patterns.filter((pat) => isMatch(pat, offset, ch));

        if (this.patterns.length > 0) {
          const len = 1 + offset;
          this.isFinal = this.patterns.some((pat) => pat.length === len);
          this.strOffset++;
        } else {
          this.isError = true;
        }
        return this;
      }
    } as Acceptor & { patterns: string[] };
  }
};

const ThaiRules: AcceptorCreator[] = [Rule0, PartRule];

export = ThaiRules;
