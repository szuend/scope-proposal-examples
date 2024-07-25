
import { GeneratedRangeBuilder, OriginalScopeBuilder } from "../scopes_builder.mjs";

export function scopes(names) {
  const moduleScopes = new OriginalScopeBuilder(names)
    .start(0, 0, 'global', undefined, ['globalThis'])
    .start(0, 0, 'module', undefined, ['MODULE_CONSTANT', 'Logger'])
    .start(6, 12, 'function', 'log', ['x'])
    .end(8, 3)
    .end(10, 0)
    .end(10, 0)
    .build();

  const mainScopes = new OriginalScopeBuilder(names)
    .start(0, 0, 'global', undefined, ['globalThis', 'Logger', 'inner', 'outer'])
    .start(3, 14, 'function', 'inner', ['y'])
    .start(4, 9, 'block')
    .end(6, 3)
    .end(7, 1)
    .start(9, 14, 'function', 'outer', ['z'])
    .start(10, 9, 'block')
    .end(12, 3)
    .end(13, 1)
    .end(18, 0)
    .build();

  const originalScopes = [moduleScopes, mainScopes]; // Ordering is important. Must match what's in the source map under 'sources'.
  
  const generatedRanges = new GeneratedRangeBuilder(names)
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 0 }, bindings: ['globalThis']})
    .start(0, 0, { definition: { sourceIdx: 1, scopeIdx: 0 }, bindings: ['globalThis']})
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 1 }, bindings: ['\'module_constant\'', undefined]})
    .start(0, 0, { definition: { sourceIdx: 1, scopeIdx: 5 }, callsite: { sourceIdx: 1, line: 15, column: 0 }, bindings: ['42']})
    .start(0, 0, { definition: { sourceIdx: 1, scopeIdx: 6}})
    .start(0, 0, { definition: { sourceIdx: 1, scopeIdx: 1 }, callsite: { sourceIdx: 1, line: 11, column: 4 }, bindings: ['42']})
    .start(0, 0, { definition: { sourceIdx: 1, scopeIdx: 2}})
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 2 }, callsite: { sourceIdx: 1, line: 5, column: 4 }, bindings: ['42']})
    .end(0, 16)
    .end(0, 16)
    .end(0, 16)
    .end(0, 16)
    .end(0, 16)
    .start(0, 16, { definition: { sourceIdx: 1, scopeIdx: 5 }, callsite: { sourceIdx: 1, line: 16, column: 0 }, bindings: ['\'hello\'']})
    .start(0, 16, { definition: { sourceIdx: 1, scopeIdx: 6}})
    .start(0, 16, { definition: { sourceIdx: 1, scopeIdx: 1 }, callsite: { sourceIdx: 1, line: 11, column: 4 }, bindings: ['\'hello\'']})
    .start(0, 16, { definition: { sourceIdx: 1, scopeIdx: 2}})
    .start(0, 16, { definition: { sourceIdx: 0, scopeIdx: 2 }, callsite: { sourceIdx: 1, line: 5, column: 4 }, bindings: ['\'hello\'']})
    .end(0, 37)
    .end(0, 37)
    .end(0, 37)
    .end(0, 37)
    .end(0, 37)
    .end(1, 0)
    .end(1, 0)
    .end(1, 0)
    .build();

  return {names, originalScopes, generatedRanges};
}
