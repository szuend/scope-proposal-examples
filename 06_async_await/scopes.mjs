
import { GeneratedRangeBuilder, OriginalScopeBuilder } from "../scopes_builder.mjs";

export function scopes(names) {
  const originalScopes = [new OriginalScopeBuilder(names)
    .start(0, 0, 'global', undefined, ['addAndLog'])
    .start(1, 24, 'function', 'addAndLog', ['x', 'y', 'z', 'xValue', 'yValue', 'zValue'])
    .end(6, 1)
    .end(8, 72)
    .build()];
  
  const generatedRanges = new GeneratedRangeBuilder(names)
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 0 }, bindings: ['addAndLog']})
    .start(9, 18, { definition: { sourceIdx: 0, scopeIdx: 1 }, bindings:
      ['x', 'y', 'z', undefined, undefined, undefined], isScope: true})
    .start(10, 53, { definition:  { sourceIdx: 0, scopeIdx: 1}, bindings:
      ['x', 'y', 'z', 'xValue', 'yValue', 'zValue'], isScope: true})
    .end(14, 5)
    .end(15, 1)
    .end(17, 0)
    .build();

  return {names, originalScopes, generatedRanges};
}
