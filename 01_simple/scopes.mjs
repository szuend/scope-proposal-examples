
import { GeneratedRangeBuilder, OriginalScopeBuilder } from "../scopes_builder.mjs";

export function scopes(names) {
  const originalScopes = [new OriginalScopeBuilder(names)
    .start(0, 0, 'global', ['addWithMultiply'])
    .start(1, 24, 'function', 'addWithMultiply', ['arg1', 'arg2', 'arg3', 'intermediate'])
    .start(3, 26, 'block', undefined, ['result'])
    .end(6, 3)
    .end(8, 1)
    .end(12, 0)
    .build()];
  
  const generatedRanges = new GeneratedRangeBuilder(names)
    .start(0, 0, { definition: { sourceIdx: 0, scopeIdx: 0 }, bindings: [[
      {line: 0, column: 0, name: 'n'},
      {line: 0, column: 10, name: undefined},
      {line: 0, column: 78, name: 'n'},
    ]]})
    .start(0, 10, { definition: { sourceIdx: 0, scopeIdx: 1 }, bindings: [
      [{line: 0, column: 10, name: 'n'},
       {line: 0, column: 47, name: undefined},
       {line: 0, column: 69, name: 'n'}],
      't',
      'e',
      'r',
    ]})
    .start(0, 47, { definition: { sourceIdx: 0, scopeIdx: 2 }, bindings: ['n']})
    .end(0, 69)
    .end(0, 78)
    .end(0, 86)
    .build();

  return {names, originalScopes, generatedRanges};
}
