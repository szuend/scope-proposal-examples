import {Glob} from 'glob';

import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';

const SEARCH_PATH = url.fileURLToPath(new URL('.', import.meta.url));  // __dirname

/** Removes old scope entries */
function cleanSourceMap(sourceMap) {
  delete sourceMap.originalScopes;
  delete sourceMap.generatedRanges;
}

(async function main() {
  const glob = new Glob('**/*.map', {
    root: SEARCH_PATH,
    ignore: "node_modules/**",
  });

  for (const relativeMapPath of glob.iterateSync()) {
    // Check if source map is accompanied by a "scopes.mjs".
    const sourceMapPath = path.resolve(SEARCH_PATH, relativeMapPath);
    const directory = path.dirname(sourceMapPath);
    const scopeScriptPath = path.resolve(SEARCH_PATH, directory, "scopes.mjs");
    if (!fs.existsSync(scopeScriptPath)) continue;

    process.stdout.write(`Encoding scopes into ${relativeMapPath}... `);

    const sourceMap = JSON.parse(fs.readFileSync(sourceMapPath, {encoding: 'utf-8'}));
    const scopeScript = await import(scopeScriptPath);

    const {names, originalScopes, generatedRanges} = scopeScript.scopes(sourceMap.names ?? []);

    cleanSourceMap(sourceMap);
    sourceMap.names = names;
    sourceMap.originalScopes = originalScopes;
    sourceMap.generatedRanges = generatedRanges;

    fs.writeFileSync(sourceMapPath, JSON.stringify(sourceMap), {encoding: 'utf-8'});

    process.stdout.write('DONE\n');
  }
})();
