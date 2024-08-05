
import { GeneratedRangeBuilder, OriginalScopeBuilder } from "../scopes_builder.mjs";

export function scopes(names) {
  const originalScopes = [new OriginalScopeBuilder(names)
    .start(0, 0, 'global', undefined, ['globalThis', 'addAndLog'])
    .start(1, 24, 'function', 'addAndLog', ['x', 'y', 'z', 'xValue', 'yValue', 'zValue'])
    .end(6, 1)
    .end(9, 0)
    .build()];
  
  const generatedRanges = new GeneratedRangeBuilder(names)
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 0 }, bindings: ['globalThis', 'addAndLog'] })
    .start(39, 42, { definition: { sourceIdx: 0, scopeIdx: 1 }, bindings: ['x', 'y', 'z', 'xValue', 'yValue', 'zValue'] })
    .end(50, 9)
    .end(55, 1)
    .build();

  return {names, originalScopes, generatedRanges};
}
