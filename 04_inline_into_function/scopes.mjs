
import { GeneratedRangeBuilder, OriginalScopeBuilder } from "../scopes_builder.mjs";

export function scopes(names) {
  const mainScopes = new OriginalScopeBuilder(names)
    .start(0, 0, 'global', undefined, ['globalThis', 'log', 'inner', 'outer'])
    .start(0, 0, 'script', undefined, ['CALL_CHANCE'])
    .start(3, 12, 'function', 'log', ['x'])
    .end(5, 1)
    .start(7, 14, 'function', 'inner', ['x'])
    .end(9, 1)
    .start(11, 14, 'function', 'outer', ['x', 'shouldCall'])
    .start(14, 18, 'block')
    .end(16, 3)
    .end(17, 1)
    .end(21, 0)
    .end(21, 0)
    .build();

  const originalScopes = [mainScopes];
  
  const generatedRanges = new GeneratedRangeBuilder(names)
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 0 }, bindings: ['globalThis', undefined, undefined, 'a']})
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 1 }, bindings: ['0.5']})
    .start(0, 10, { definition: { sourceIdx: 0, scopeIdx: 6 }, bindings: ['c', 'b'], isScope: true})
    .start(0, 22, { definition: { sourceIdx: 0, scopeIdx: 1}, bindings: ['0.5']})
    .end(0, 24)
    .start(0, 70, { definition: { sourceIdx: 0, scopeIdx: 7 }})
    .start(0, 70, { definition: { sourceIdx: 0, scopeIdx: 4}, callsite: { sourceIdx: 0, line: 15, column: 4 }, bindings: ['c']})
    .start(0, 70, { definition: { sourceIdx: 0, scopeIdx: 2}, callsite: { sourceIdx: 0, line: 8, column: 2 }, bindings: ['c']})
    .end(0, 84)
    .end(0, 84)
    .end(0, 84)
    .end(0, 85)
    .end(0, 99)
    .end(0, 99)
    .build();

  return {names, originalScopes, generatedRanges};
}