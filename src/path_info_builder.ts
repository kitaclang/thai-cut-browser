import type { Acceptor } from "./acceptors";
import type { PathInfo } from "./path_selector";

export default function createPathInfoBuilder() {
  return {
    buildByAcceptors(path: PathInfo[], finalAcceptors: Acceptor[], i: number): PathInfo[] {
      const infos = finalAcceptors.map((acceptor) => {
        const p = i - acceptor.strOffset + 1;
        const base = path[p];

        const info: PathInfo = {
          p,
          mw: base.mw + (acceptor.mw ?? 0),
          w: acceptor.w + base.w,
          unk: (acceptor.unk ?? 0) + base.unk,
          type: acceptor.type
        };

        if (acceptor.type === "PART") {
          for (let j = p + 1; j <= i; j++) {
            path[j].merge = p;
          }
          info.merge = p;
        }

        return info;
      });

      return infos.filter(Boolean);
    },

    fallback(path: PathInfo[], leftBoundary: number, text: string, i: number): PathInfo {
      const base = path[leftBoundary];
      if (text[i].match(/[\u0E48-\u0E4E]/)) {
        if (leftBoundary !== 0) {
          leftBoundary = path[leftBoundary].p as number;
        }

        return {
          p: leftBoundary,
          mw: 0,
          w: 1 + base.w,
          unk: 1 + base.unk,
          type: "UNK"
        };
      }

      return {
        p: leftBoundary,
        mw: base.mw,
        w: 1 + base.w,
        unk: 1 + base.unk,
        type: "UNK"
      };
    },

    build(path: PathInfo[], finalAcceptors: Acceptor[], i: number, leftBoundary: number, text: string): PathInfo[] {
      const basicPathInfos = this.buildByAcceptors(path, finalAcceptors, i);
      if (basicPathInfos.length > 0) {
        return basicPathInfos;
      }
      return [this.fallback(path, leftBoundary, text, i)];
    }
  };
}
