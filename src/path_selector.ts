export interface PathInfo {
  p: number | null;
  w: number;
  unk: number;
  type: string;
  mw: number;
  merge?: number;
}

export default function createPathSelector() {
  return {
    selectPath(paths: PathInfo[]): PathInfo {
      return paths.reduce<PathInfo | null>((selectedPath, path) => {
        if (selectedPath === null) {
          return path;
        }

        if (path.unk < selectedPath.unk) return path;
        if (path.unk === selectedPath.unk) {
          if (path.mw < selectedPath.mw) return path;
          if (path.mw === selectedPath.mw) {
            if (path.w < selectedPath.w) return path;
          }
        }

        return selectedPath;
      }, null) as PathInfo;
    },

    createPath(): PathInfo[] {
      return [{ p: null, w: 0, unk: 0, type: "INIT", mw: 0 }];
    }
  };
}
