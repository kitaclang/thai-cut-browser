const wordcut = require("../lib/wordcut");

describe("Wordcut with custom dictionary", function() {
  it("should recognize words in dictionaryWords", function() {
    wordcut.init(["กินข้าว", "อร่อยมาก", "อร่อยมากมาก", "booby-trap"], true);
    const segmentedResult = wordcut.cutIntoArray("ฉันชอบกินข้าวอร่อยมากมาก");
    expect(segmentedResult).toStrictEqual(["ฉัน", "ชอบ", "กินข้าว", "อร่อยมากมาก"]);
  });

  it("should recognize word in custom dict and additionalWords", function() {
    wordcut.init(["กินข้าว", "อร่อยมาก", "อร่อยมากมาก", "booby-trap"], true, [
      "ข้าวอร่อยมากมาก",
      "ชอบกิน"
    ]);
    const segmentedResult = wordcut.cutIntoArray("ฉันชอบกินข้าวอร่อยมากมาก");
    expect(segmentedResult).toStrictEqual(["ฉัน", "ชอบกิน", "ข้าวอร่อยมากมาก"]);
  });
});
