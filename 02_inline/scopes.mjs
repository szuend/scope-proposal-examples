
import { GeneratedRangeBuilder, OriginalScopeBuilder } from "../scopes_builder.mjs";

export function scopes(names) {
  const originalScopes = [new OriginalScopeBuilder(names)
    .start(0, 0, 'global', undefined, ['globalThis', 'log', 'inner', 'outer'])
    .start(2, 17, 'function', 'log', ['x'])
    .end(4, 1)
    .start(7, 19, 'function', 'inner', ['y'])
    .end(9, 1)
    .start(12, 19, 'function', 'outer', ['z'])
    .end(14, 1)
    .end(18, 0)
    .build()];
  
  const generatedRanges = new GeneratedRangeBuilder(names)
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 0 }, bindings: ['globalThis']})
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 5 }, callsite: { sourceIdx: 0, line: 16, column: 0 }, bindings: ['42']})
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 3 }, callsite: { sourceIdx: 0, line: 13, column: 2 }, bindings: ['42']})
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 1 }, callsite: { sourceIdx: 0, line: 8, column: 2}, bindings: ['42']})
    .end(0, 16)
    .end(0, 16)
    .end(0, 16)
    .start(0, 16, { definition: { sourceIdx: 0, scopeIdx: 5 }, callsite: { sourceIdx: 0, line: 17, column: 0 }, bindings: ['\'test\'']})
    .start(0, 16, { definition: { sourceIdx: 0, scopeIdx: 3 }, callsite: { sourceIdx: 0, line: 13, column: 2 }, bindings: ['\'test\'']})
    .start(0, 16, { definition: { sourceIdx: 0, scopeIdx: 1 }, callsite: { sourceIdx: 0, line: 8, column: 2}, bindings: ['\'test\'']})
    .end(0, 36)
    .end(0, 36)
    .end(0, 36)
    .end(1, 0)
    .build();
  
  return {names, originalScopes, generatedRanges};
}
