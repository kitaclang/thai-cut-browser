const PrefixTree = require("../lib/prefixtree.js");

describe("PrefixTree", () => {
  it("should be able to handle one char", () => {
    const tree = PrefixTree.createPrefixTree([["A", 10]]);
    expect(tree.lookup(0, 0, "A")).toStrictEqual([0, true, 10]);
    expect(tree.lookup(0, 0, "C")).toBeNull();
  });

  it("should be able to take null workload", () => {
    const tree = PrefixTree.createPrefixTree(null);
    expect(tree.lookup(0, 0, "C")).toBeNull();
  });

  it("should be able to handle two chars", () => {
    const tree = PrefixTree.createPrefixTree([["AB", 20]]);
    expect(tree.lookup(0, 0, "A")).toStrictEqual([0, false, null]);
    expect(tree.lookup(0, 1, "B")).toStrictEqual([0, true, 20]);
  });

  it("should be able to handle two words", () => {
    const tree = PrefixTree.createPrefixTree([
      ["A", 10],
      ["AB", 20]
    ]);
    expect(tree.lookup(0, 0, "A")).toStrictEqual([0, true, 10]);
    expect(tree.lookup(0, 1, "B")).toStrictEqual([1, true, 20]);
  });

  it("should be able to handle two words desc", () => {
    const tree = PrefixTree.createPrefixTree([
      ["A", 10],
      ["AB", 20]
    ]);
    expect(tree.lookup(0, 0, "A")).toStrictEqual([0, true, 10]);
    expect(tree.lookup(0, 1, "B")).toStrictEqual([1, true, 20]);
  });

  it("should be able to handle 3 words", () => {
    const tree = PrefixTree.createPrefixTree([
      ["มา", true],
      ["ตา", true],
      ["มาตรา", true]
    ]);

    const [nodeId0] = tree.lookup(0, 0, "ม");
    expect(nodeId0).toBeGreaterThanOrEqual(0);
    const [nodeId1] = tree.lookup(nodeId0, 1, "า");
    expect(nodeId1).toBeGreaterThanOrEqual(0);
    const [nodeId2] = tree.lookup(nodeId1, 2, "ต");
    expect(nodeId2).toBeGreaterThanOrEqual(0);
    const [nodeId3] = tree.lookup(nodeId2, 3, "ร");
    expect(nodeId3).toBeGreaterThanOrEqual(0);
    const [, isFinal4] = tree.lookup(nodeId3, 4, "า");
    expect(isFinal4).toBe(true);
  });
});
