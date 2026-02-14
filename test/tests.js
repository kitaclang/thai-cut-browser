const wordcut = require("../lib/wordcut");

describe("Wordcut", function() {
  beforeEach(function() {
    wordcut.init();
  });

  it("should segment a simple word", function() {
    expect(wordcut.cut("กากา")).toStrictEqual("กา|กา");
  });

  it("should segment a word the number", function() {
    expect(wordcut.cut("กา2ตัว")).toStrictEqual("กา|2|ตัว");
  });

  it("should segment text with English word", function() {
    const segmentedResult = wordcut.cut("กาDogมี");
    expect(segmentedResult).toStrictEqual("กา|Dog|มี");
  });

  it("should segment thai word with parenthesis", function() {
    const segmentedResult = wordcut.cut("อยู่ใน(วงเล็บ)");
    expect(segmentedResult).toStrictEqual("อยู่|ใน|(|วงเล็บ|)");
  });

  it("should segment english word with quotes", function() {
    const segmentedResult = wordcut.cut('ลอง"prt"');
    expect(segmentedResult).toStrictEqual('ลอง|"|prt|"');
  });

  it("should segment english word with prime", function() {
    const segmentedResult = wordcut.cut("ลอง`prt`");
    expect(segmentedResult).toStrictEqual("ลอง|`|prt|`");
  });

  it("should segment text with English word and space", function() {
    const segmentedResult = wordcut.cut("กา Dog มี");
    expect(segmentedResult).toStrictEqual("กา| |Dog| |มี");
  });

  it("should segment text with English word and repeated space", function() {
    const segmentedResult = wordcut.cut("NO BREAK SPACES        IS HERE นะครับ");
    expect(segmentedResult).toStrictEqual("NO| |BREAK| |SPACES|        |IS| |HERE| |นะ|ครับ");
  });

  it("should segment string with at sign", function() {
    const segmentedResult = wordcut.cut("ฉัน @รัก@ เธอมาก@mai@จริง");
    expect(segmentedResult).toStrictEqual("ฉัน| |@|รัก|@| |เธอ|มาก|@|mai|@|จริง");
  });

  it("should split obvious pattern เหน็ด", function() {
    const segmentedResult = wordcut.cut("เหน็ด");
    expect(segmentedResult).toStrictEqual("เหน็ด");
  });

  it("should split obvious pattern เด้", function() {
    const segmentedResult = wordcut.cut("เด้");
    expect(segmentedResult).toStrictEqual("เด้");
  });

  it("should split มั้ย", function() {
    const segmentedResult = wordcut.cut("มั้ย");
    expect(segmentedResult).toStrictEqual("มั้ย");
  });

  it("should split เชียง", function() {
    const segmentedResult = wordcut.cut("เชียง");
    expect(segmentedResult).toStrictEqual("เชียง");
  });

  it("should split แม่ง", function() {
    const segmentedResult = wordcut.cut("แม่ง");
    expect(segmentedResult).toStrictEqual("แม่ง");
  });

  it("should split ชาก", function() {
    const segmentedResult = wordcut.cut("ชาก");
    expect(segmentedResult).toStrictEqual("ชาก");
  });

  it("should split ง่วง", function() {
    const segmentedResult = wordcut.cut("ง่วง");
    expect(segmentedResult).toStrictEqual("ง่วง");
  });

  it("should not split ไพลิน", function() {
    const segmentedResult = wordcut.cut("ไพลิน");
    expect(segmentedResult).toStrictEqual("ไพลิน");
  });

  it("should split parenthesis", function() {
    const segmentedResult = wordcut.cut("(test)");
    expect(segmentedResult).toStrictEqual("(|test|)");
  });

  it("should split slash", function() {
    const segmentedResult = wordcut.cut("dog/cat");
    expect(segmentedResult).toStrictEqual("dog|/|cat");
  });

  it("should split dash", function() {
    const segmentedResult = wordcut.cut("รับ-ส่ง");
    expect(segmentedResult).toStrictEqual("รับ|-|ส่ง");
  });

  it("should not split เตอร์", function() {
    const segmentedResult = wordcut.cut("เตอร์");
    expect(segmentedResult).toStrictEqual("เตอร์");
  });

  it("should not split เตอร์", function() {
    const segmentedResult = wordcut.cut("เตอร์");
    expect(segmentedResult).toStrictEqual("เตอร์");
  });

  it("should not split energy energy", function() {
    const segmentedResult0 = wordcut.cut("energy");
    expect(segmentedResult0).toStrictEqual("energy");
    const segmentedResult1 = wordcut.cut("energy");
    expect(segmentedResult1).toStrictEqual("energy");
  });

  it("should split dot", function() {
    const segmentedResult = wordcut.cut("energy.");
    expect(segmentedResult).toStrictEqual("energy|.");
  });

  it("should split into array", function() {
    const segmentedResult = wordcut.cutIntoArray("ฉันชอบกินข้าว");
    expect(segmentedResult).toStrictEqual(["ฉัน", "ชอบ", "กิน", "ข้าว"]);
  });

  it("should split โอโห", function() {
    const segmentedResult = wordcut.cut("โอโห");
    expect(segmentedResult).toStrictEqual("โอ|โห");
  });

  it("should split โอ้โห", function() {
    const segmentedResult = wordcut.cut("โอ้โห");
    expect(segmentedResult).toStrictEqual("โอ้|โห");
  });
});
