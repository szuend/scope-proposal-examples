
import { GeneratedRangeBuilder, OriginalScopeBuilder } from "../scopes_builder.mjs";

export function scopes(names) {
  const baseIdx = names.length;
  names.push('log', 'inner', 'outer');

  const originalScopes = [new OriginalScopeBuilder()
    .start(0, 0, 'global')
    .start(2, 17, 'function', baseIdx)
    .end(4, 1)
    .start(7, 19, 'function', baseIdx + 1)
    .end(9, 1)
    .start(12, 19, 'function', baseIdx + 2)
    .end(14, 1)
    .end(18, 0)
    .build()];
  
  const generatedRanges = new GeneratedRangeBuilder()
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 0 }})
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 5 }, callsite: { sourceIdx: 0, line: 16, column: 0 }})
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 3 }, callsite: { sourceIdx: 0, line: 13, column: 2 }})
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 1 }, callsite: { sourceIdx: 0, line: 8, column: 2}})
    .end(0, 16)
    .end(0, 16)
    .end(0, 16)
    .start(0, 16, { definition: { sourceIdx: 0, scopeIdx: 5 }, callsite: { sourceIdx: 0, line: 17, column: 0 }})
    .start(0, 16, { definition: { sourceIdx: 0, scopeIdx: 3 }, callsite: { sourceIdx: 0, line: 13, column: 2 }})
    .start(0, 16, { definition: { sourceIdx: 0, scopeIdx: 1 }, callsite: { sourceIdx: 0, line: 8, column: 2}})
    .end(0, 36)
    .end(0, 36)
    .end(0, 36)
    .end(1, 0)
    .build();
  
  return {names, originalScopes, generatedRanges};
}
