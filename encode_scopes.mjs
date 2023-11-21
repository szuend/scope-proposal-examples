import {Glob} from 'glob';
import * as vlq from 'vlq';

import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';

const SEARCH_PATH = url.fileURLToPath(new URL('.', import.meta.url));  // __dirname

class ScopeEncoder {
  #scopesByLines = [];
  #currentScopeMarkers = [];
  #currentScope = '';
  #lastRecordedColumn = 0;
  #sourceMap;
  #lastNameIdx = 0;
  // Use sensible defaults so we save on some tertiary statements for encoding the first definition.
  #lastDefinition = {
    sourceIndex: 0,
    startLine: 0,
    startColumn: 0,
  };
  #lastCallsite = {
    sourceIndex: 0,
    line: 0,
    column: 0,
  };
  #lastBindingsNameIdx = 0;

  constructor(sourceMap) {
    this.#sourceMap = sourceMap;
  }

  get currentLine() {
    return this.#scopesByLines.length;
  }

  finishLine() {
    this.#scopesByLines.push(this.#currentScopeMarkers);
    this.#currentScopeMarkers = [];
    this.#lastRecordedColumn = 0;
  }

  finishScope() {
    this.#currentScopeMarkers.push(this.#currentScope);
    this.#currentScope = '';
  }

  encode() {
    this.#sourceMap.scopes = this.#scopesByLines.map(scopeMarkers => scopeMarkers.join(',')).join(';');
  }

  addColumn(column) {
    this.#add(column - this.#lastRecordedColumn);
    this.#lastRecordedColumn = column;
  }

  addFieldFlags(hasName, hasDefinition, hasCallsite) {
    let flags = 0;
    flags |= (hasName ? 0x1 : 0);
    flags |= (hasDefinition ? 0x2 : 0);
    flags |= (hasCallsite ? 0x4 : 0);
    this.#add(flags);
  }

  addInfoFlags(isFunction, inheritParentBindigs, skipWhenStepping, collapse) {
    let flags = 0;
    flags |= (isFunction ? 0x1 : 0);
    flags |= (inheritParentBindigs ? 0x2 : 0);
    flags |= (skipWhenStepping ? 0x4 : 0);
    flags |= (collapse ? 0x8 : 0);
    this.#add(flags);
  }

  addName(name) {
    this.#lastNameIdx = this.#addName(name, this.#lastNameIdx);
  }

  #addName(name, lastIdx) {
    if (this.#sourceMap.names === undefined) {
      this.#sourceMap.names = [];
    }
    let idx = this.#sourceMap.names.indexOf(name);
    if (idx === -1) {
      idx = this.#sourceMap.length;
      this.#sourceMap.names.push(name);
    }

    this.#add(idx - lastIdx);
    return idx;
  }

  addDefinition(definition) {
    this.#add(definition.sourceIndex - this.#lastDefinition.sourceIndex);

    const sameSource = definition.sourceIndex === this.#lastDefinition.sourceIndex;
    const lastStartLine = sameSource ? this.#lastDefinition.startLine : 0;
    this.#add(definition.startLine - lastStartLine);

    const sameLine = definition.startLine === lastStartLine;
    const lastStartColumn = (sameSource && sameLine) ? this.#lastDefinition.startColumn : 0;
    this.#add(definition.startColumn - lastStartColumn);

    this.#add(definition.endLine - definition.startLine);

    const scopeEndSameLine = definition.startLine === definition.endLine;
    const offsetEndColumn = scopeEndSameLine ? definition.startColumn : 0;
    this.#add(definition.endColumn - offsetEndColumn);

    this.#lastDefinition = definition;
  }

  addCallsite(callsite) {
    this.#add(callsite.sourceIndex - this.#lastCallsite.sourceIndex);

    const sameSource = callsite.sourceIndex === this.#lastCallsite.sourceIndex;
    const lastLine = sameSource ? this.#lastCallsite.line : 0;
    this.#add(callsite.line - lastLine);

    const sameLine = callsite.line === lastLine;
    const lastColumn = sameLine ? this.#lastCallsite.column : 0;
    this.#add(callsite.column - lastColumn);
  }

  addBindings(bindings) {
    this.#add(bindings.length);

    for (const [originalName, expression] of bindings) {
      const nameIdx = this.#addName(originalName, this.#lastBindingsNameIdx);
      const expressionIdx = this.#addName(expression, nameIdx);
      this.#lastBindingsNameIdx = expressionIdx;
    }
  }

  #add(n) {
    this.#currentScope += vlq.encode(n);
  }
}

function encode(sourceMap, scopes) {
  // const encoder = new ScopeEncoder(sourceMap);

  // for (const scope of scopes) {
  //   // Encode empty lines until we reach "scope.line".
  //   while (encoder.currentLine < scope.line) encoder.finishLine();

  //   encoder.addColumn(scope.column);

  //   if ('type' in scope) {
  //     // Encode scope start
  //     const hasName = 'name' in scope;
  //     const hasDefinition = 'definition' in scope;
  //     const hasCallsite = 'callsite' in scope;
  //     encoder.addFieldFlags(hasName, hasDefinition, 'callsite' in scope);
  //     encoder.addInfoFlags(scope.type === 'function',
  //         /* inheritParentBindings is always true for JS */ true,
  //         /* skip */ false, Boolean(scope.collapse));
  //     if (hasName) encoder.addName(scope.name);
  //     if (hasDefinition) encoder.addDefinition(scope.definition);
  //     if (hasCallsite) encoder.addCallsite(scope.callsite);
  //     encoder.addBindings(scope.bindings ?? []);
  //   }

  //   encoder.finishScope();
  // }
  // encoder.finishLine();
  // encoder.encode();

  // Normalize bindings for raw scopes.
  const s = [];
  collectScopes(scopes.generatedScopes);

  function collectScopes(scope) {
    if (!scope) return;
    s.push(scope);
    scope.children?.forEach(collectScopes);
  }

  for (const scope of s) {
    scope.bindings = scope.bindings.map(binding => {
      if (!binding) return [];
      if (Array.isArray(binding)) return binding;
      return [{expression: binding.expression, from: scope.start, to: scope.end}];
    });
  }

  sourceMap.rawOriginalScopes = scopes.originalScopes;
  sourceMap.rawGeneratedScopes = scopes.generatedScopes;
}

/** Removes old scope entries */
function cleanSourceMap(sourceMap) {
  delete sourceMap.rawOriginalScopes;
  delete sourceMap.rawGeneratedScopes;
  delete sourceMap.originalScopes;
  delete sourceMap.generatedScopes;
  delete sourceMap.scopes;
}

(function main() {
  const glob = new Glob('**/*.map', {
    root: SEARCH_PATH,
    ignore: "node_modules/**",
  });

  for (const relativeMapPath of glob.iterateSync()) {
    // Check if source map is accompanied by a "scopes.json".
    const sourceMapPath = path.resolve(SEARCH_PATH, relativeMapPath);
    const directory = path.dirname(sourceMapPath);
    const scopeJsonPath = path.resolve(SEARCH_PATH, directory, "scopes.json");
    if (!fs.existsSync(scopeJsonPath)) continue;

    process.stdout.write(`Encoding scopes into ${relativeMapPath}... `);

    const sourceMap = JSON.parse(fs.readFileSync(sourceMapPath, {encoding: 'utf-8'}));
    const scopes = JSON.parse(fs.readFileSync(scopeJsonPath, {encoding: 'utf-8'}));

    cleanSourceMap(sourceMap);
    encode(sourceMap, scopes);

    fs.writeFileSync(sourceMapPath, JSON.stringify(sourceMap), {encoding: 'utf-8'});

    process.stdout.write('DONE\n');
  }
})();
