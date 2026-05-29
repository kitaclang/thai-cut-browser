/**
 * Shared word-array validation helper.
 * Pure module, no I/O.
 */

const MAX_LENGTH = 1_000_000;

/**
 * Asserts that `value` is a `string[]` with at most 1,000,000 elements.
 *
 * @param label - The option name used in error messages (e.g. "dictionaryWords").
 * @param value - The value to validate.
 * @throws {TypeError} If `value` is not an array or contains a non-string element.
 * @throws {RangeError} If the array length exceeds 1,000,000.
 */
export function validateWordArray(
  label: string,
  value: unknown
): asserts value is string[] {
  if (!Array.isArray(value)) {
    throw new TypeError(
      `${label} must resolve to an array of strings (got typeof ${typeof value})`
    );
  }

  if (value.length > MAX_LENGTH) {
    throw new RangeError(
      `${label} length ${value.length} exceeds maximum ${MAX_LENGTH}`
    );
  }

  for (let i = 0; i < value.length; i++) {
    if (typeof value[i] !== "string") {
      throw new TypeError(
        `${label} element at index ${i} must be a string (got typeof ${typeof value[i]})`
      );
    }
  }
}
