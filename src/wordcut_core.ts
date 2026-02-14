import type { PathInfo } from "./path_selector";

interface Range {
  s: number;
  e: number;
  text?: string;
}

interface WordcutCoreLike {
  buildPath(text: string): PathInfo[];
  pathToRanges(path: PathInfo[]): Range[];
  rangesToText(text: string, ranges: Range[], delimiter: string): string;
  pathSelector: {
    createPath(): PathInfo[];
    selectPath(paths: PathInfo[]): PathInfo;
  };
  pathInfoBuilder: {
    build(path: PathInfo[], finalAcceptors: unknown[], i: number, leftBoundary: number, text: string): PathInfo[];
  };
  acceptors: {
    reset(): void;
    transit(ch: string): void;
    getFinalAcceptors(): unknown[];
  };
}

const WordcutCore = {
  buildPath(this: WordcutCoreLike, text: string): PathInfo[] {
    const path = this.pathSelector.createPath();
    let leftBoundary = 0;

    this.acceptors.reset();
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      this.acceptors.transit(ch);

      const possiblePathInfos = this.pathInfoBuilder.build(
        path,
        this.acceptors.getFinalAcceptors(),
        i,
        leftBoundary,
        text
      );

      const selectedPath = this.pathSelector.selectPath(possiblePathInfos);
      path.push(selectedPath);

      if (selectedPath.type !== "UNK") {
        leftBoundary = i;
      }
    }

    return path;
  },

  pathToRanges(path: PathInfo[]): Range[] {
    let e = path.length - 1;
    const ranges: Range[] = [];

    while (e > 0) {
      const info = path[e];
      let s = info.p as number;

      if (info.merge !== undefined && ranges.length > 0) {
        const r = ranges[ranges.length - 1];
        r.s = info.merge;
        s = r.s;
      } else {
        ranges.push({ s, e });
      }
      e = s;
    }

    return ranges.reverse();
  },

  rangesToText(text: string, ranges: Range[], delimiter: string): string {
    return ranges.map((r) => text.substring(r.s, r.e)).join(delimiter);
  },

  cut(this: WordcutCoreLike, text: string, delimiter?: string): string {
    const path = this.buildPath(text);
    const ranges = this.pathToRanges(path);
    return this.rangesToText(text, ranges, delimiter === undefined ? "|" : delimiter);
  },

  cutIntoRanges(this: WordcutCoreLike, text: string, noText?: boolean): Range[] {
    const path = this.buildPath(text);
    const ranges = this.pathToRanges(path);

    if (!noText) {
      ranges.forEach((r) => {
        r.text = text.substring(r.s, r.e);
      });
    }

    return ranges;
  },

  cutIntoArray(this: WordcutCoreLike, text: string): string[] {
    const path = this.buildPath(text);
    const ranges = this.pathToRanges(path);
    return ranges.map((r) => text.substring(r.s, r.e));
  }
};

export = WordcutCore;
