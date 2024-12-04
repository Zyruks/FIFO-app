/**
 * The `validate` function in TypeScript checks if a given
 * value matches a specified regular expression pattern.
 *
 * @param {string} value - A string that you want to
 *   validate against a regular expression pattern.
 * @param {RegExp} pattern - The `pattern` parameter is a
 *   regular expression (RegExp) that is used to validate
 *   the `value` parameter in the `validate` function. The
 *   `test` method of the regular expression is used to
 *   check if the `value` matches the specified pattern.
 * @returns The function `validate` returns a boolean value
 *   indicating whether the input `value` matches the
 *   specified regular expression `pattern`.
 */
export const validatePattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};
