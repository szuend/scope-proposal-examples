
import { GeneratedRangeBuilder, OriginalScopeBuilder } from "../scopes_builder.mjs";

export function scopes(names) {
  const moduleScopes = new OriginalScopeBuilder(names)
    .start(0, 0, 'global')
    .start(0, 0, 'module', undefined, ['MODULE_CONSTANT', 'Logger'])
    .start(6, 12, 'function', 'log', ['x'])
    .end(8, 3)
    .end(10, 0)
    .end(10, 0)
    .build();

  const mainScopes = new OriginalScopeBuilder(names)
    .start(0, 0, 'global', undefined, ['Logger', 'inner', 'outer'])
    .start(3, 14, 'function', 'inner', ['x'])
    .end(5, 1)
    .start(7, 14, 'function', 'outer', ['x'])
    .end(9, 1)
    .end(13, 0)
    .build();

  const originalScopes = [moduleScopes, mainScopes]; // Ordering is important. Must match what's in the source map under 'sources'.
  
  const generatedRanges = new GeneratedRangeBuilder(names)
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 0 }})
    .start(0, 0, { definition: { sourceIdx: 1, scopeIdx: 0 }})
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 1 }, bindings: ['module_constant', undefined]})
    .start(0, 0, { definition: { sourceIdx: 1, scopeIdx: 3 }, callsite: { sourceIdx: 1, line: 11, column: 0 }, bindings: ['42']})
    .start(0, 0, { definition: { sourceIdx: 1, scopeIdx: 1 }, callsite: { sourceIdx: 1, line: 8, column: 2 }, bindings: ['42']})
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 2 }, callsite: { sourceIdx: 1, line: 4, column: 2 }, bindings: ['42']})
    .end(0, 16)
    .end(0, 16)
    .end(0, 16)
    .start(0, 16, { definition: { sourceIdx: 1, scopeIdx: 3 }, callsite: { sourceIdx: 1, line: 12, column: 0 }, bindings: ['null']})
    .start(0, 16, { definition: { sourceIdx: 1, scopeIdx: 1 }, callsite: { sourceIdx: 1, line: 8, column: 2 }, bindings: ['null']})
    .start(0, 16, { definition: { sourceIdx: 0, scopeIdx: 2 }, callsite: { sourceIdx: 1, line: 4, column: 2 }, bindings: ['null']})
    .end(0, 34)
    .end(0, 34)
    .end(0, 34)
    .end(1, 0)
    .end(1, 0)
    .end(1, 0)
    .build();

  return {names, originalScopes, generatedRanges};
}
