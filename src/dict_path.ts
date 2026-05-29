/**
 * Path-resolution API for the default dictionary asset.
 * No side effects — exports a single function.
 */

/**
 * Returns the absolute file path of the default dictionary asset
 * (`thai-cut-browser/default-dict.txt`) inside the installed package.
 *
 * Uses Node's `require.resolve` to locate the asset via the package
 * `exports` map.
 *
 * @remarks This function relies on the CJS `require.resolve` API and is
 * intended for Node.js CommonJS environments. It will not work in pure
 * ESM contexts (e.g. `type: "module"` without CJS interop). Browser/bundler
 * consumers should use the package subpath import instead:
 * `import dictUrl from "thai-cut-browser/default-dict.txt"`
 *
 * @throws {Error} If the asset cannot be located by the resolver.
 */
export function getDefaultDictPath(): string {
  try {
    return require.resolve("thai-cut-browser/default-dict.txt");
  } catch (err) {
    throw new Error(
      'Could not locate the default dictionary asset at "thai-cut-browser/default-dict.txt".',
      { cause: err }
    );
  }
}
