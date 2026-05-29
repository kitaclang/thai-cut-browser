/**
 * Dictionary asset format: parser and serializer.
 *
 * The Dictionary_Asset is a UTF-8 line-based text file with one word per line,
 * terminated by U+000A (LF). No I/O, no module-level side effects.
 */

/**
 * Parse a Dictionary_Asset text into an array of words.
 *
 * - Splits on `\n`
 * - Strips one trailing `\r` per segment
 * - Drops empty segments
 * - Returns `[]` on empty input
 * - Throws `Error` for non-string input
 */
export function parseDictionary(text: string): string[] {
  if (typeof text !== "string") {
    throw new Error(
      `parseDictionary expects a string (got typeof ${typeof text})`
    );
  }
  if (text.length === 0) {
    return [];
  }
  const segments = text.split("\n");
  return segments
    .map((seg) => (seg.endsWith("\r") ? seg.slice(0, -1) : seg))
    .filter((s) => s.length > 0);
}

/**
 * Serialize an array of words into Dictionary_Asset text.
 *
 * - Validates that every element is a string without line terminators
 * - Returns `""` for empty arrays
 * - Otherwise returns `words.join("\n") + "\n"`
 */
export function serializeDictionary(words: string[]): string {
  if (!Array.isArray(words)) {
    throw new Error(
      `serializeDictionary expects an array (got typeof ${typeof words})`
    );
  }
  for (let i = 0; i < words.length; i++) {
    if (typeof words[i] !== "string") {
      throw new Error(
        `serializeDictionary: element at index ${i} is not a string (got typeof ${typeof words[i]})`
      );
    }
    if (words[i].includes("\n") || words[i].includes("\r")) {
      throw new Error(
        `serializeDictionary: element at index ${i} contains a forbidden line terminator (U+000A or U+000D)`
      );
    }
  }
  if (words.length === 0) {
    return "";
  }
  return words.join("\n") + "\n";
}
