// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This file is basically the build output of the DevTools frontend file 'front_end/testing/SourceMapEncoder.ts'.

const base64Digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export function encodeVlq(n) {
  n = n >= 0 ? 2 * n : 1 - 2 * n;
  let result = "";
  while (true) {
    const digit = n & 31;
    n >>= 5;
    if (n === 0) {
      result += base64Digits[digit];
      break;
    } else {
      result += base64Digits[32 + digit];
    }
  }
  return result;
}
export function encodeVlqList(list) {
  return list.map(encodeVlq).join("");
}

export class OriginalScopeBuilder {
  #encodedScope = "";
  #lastLine = 0;
  start(line, column, kind, name, variables) {
    if (this.#encodedScope !== "") {
      this.#encodedScope += ",";
    }
    const lineDiff = line - this.#lastLine;
    this.#lastLine = line;
    const flags = (name !== void 0 ? 1 : 0) | (variables !== void 0 ? 2 : 0);
    this.#encodedScope += encodeVlqList([lineDiff, column, this.#encodeKind(kind), flags]);
    if (name !== void 0) {
      this.#encodedScope += encodeVlq(name);
    }
    if (variables !== void 0) {
      this.#encodedScope += encodeVlqList(variables);
    }
    return this;
  }
  end(line, column) {
    if (this.#encodedScope !== "") {
      this.#encodedScope += ",";
    }
    const lineDiff = line - this.#lastLine;
    this.#lastLine = line;
    this.#encodedScope += encodeVlqList([lineDiff, column]);
    return this;
  }
  build() {
    const result = this.#encodedScope;
    this.#lastLine = 0;
    this.#encodedScope = "";
    return result;
  }
  #encodeKind(kind) {
    switch (kind) {
      case "global":
        return 1;
      case "function":
        return 2;
      case "class":
        return 3;
      case "block":
        return 4;
    }
  }
}
export class GeneratedRangeBuilder {
  #encodedRange = "";
  #state = {
    line: 0,
    column: 0,
    defSourceIdx: 0,
    defScopeIdx: 0,
    callsiteSourceIdx: 0,
    callsiteLine: 0,
    callsiteColumn: 0
  };
  start(line, column, options) {
    this.#emitLineSeparator(line);
    this.#emitItemSepratorIfRequired();
    const emittedColumn = column - (this.#state.line === line ? this.#state.column : 0);
    this.#encodedRange += encodeVlq(emittedColumn);
    this.#state.line = line;
    this.#state.column = column;
    let flags = 0;
    if (options?.definition) {
      flags |= 0x1;
    }
    if (options?.callsite) {
      flags |= 0x2;
    }
    if (options?.isScope) {
      flags |= 0x4;
    }
    this.#encodedRange += encodeVlq(flags);
    if (options?.definition) {
      const { sourceIdx, scopeIdx } = options.definition;
      this.#encodedRange += encodeVlq(sourceIdx - this.#state.defSourceIdx);
      const emittedScopeIdx = scopeIdx - (this.#state.defSourceIdx === sourceIdx ? this.#state.defScopeIdx : 0);
      this.#encodedRange += encodeVlq(emittedScopeIdx);
      this.#state.defSourceIdx = sourceIdx;
      this.#state.defScopeIdx = scopeIdx;
    }
    if (options?.callsite) {
      const { sourceIdx, line: line2, column: column2 } = options.callsite;
      this.#encodedRange += encodeVlq(sourceIdx - this.#state.callsiteSourceIdx);
      const emittedLine = line2 - (this.#state.callsiteSourceIdx === sourceIdx ? this.#state.callsiteLine : 0);
      this.#encodedRange += encodeVlq(emittedLine);
      const emittedColumn2 = column2 - (this.#state.callsiteLine === line2 ? this.#state.callsiteColumn : 0);
      this.#encodedRange += encodeVlq(emittedColumn2);
      this.#state.callsiteSourceIdx = sourceIdx;
      this.#state.callsiteLine = line2;
      this.#state.callsiteColumn = column2;
    }
    for (const bindings of options?.bindings ?? []) {
      if (typeof bindings === "number") {
        this.#encodedRange += encodeVlq(bindings);
        continue;
      }
      this.#encodedRange += encodeVlq(bindings[0].nameIdx);
      this.#encodedRange += encodeVlq(-bindings.length);
      if (bindings[0].line !== line || bindings[0].column !== column) {
        throw new Error("First binding line/column must match the range start line/column");
      }
      for (let i = 1; i < bindings.length; ++i) {
        const { line: line2, column: column2, nameIdx } = bindings[i];
        const emittedLine = line2 - bindings[i - 1].line;
        const emittedColumn2 = column2 - (line2 === bindings[i - 1].line ? bindings[i - 1].column : 0);
        this.#encodedRange += encodeVlq(emittedLine);
        this.#encodedRange += encodeVlq(emittedColumn2);
        this.#encodedRange += encodeVlq(nameIdx);
      }
    }
    return this;
  }
  end(line, column) {
    this.#emitLineSeparator(line);
    this.#emitItemSepratorIfRequired();
    const emittedColumn = column - (this.#state.line === line ? this.#state.column : 0);
    this.#encodedRange += encodeVlq(emittedColumn);
    this.#state.line = line;
    this.#state.column = column;
    return this;
  }
  #emitLineSeparator(line) {
    for (let i = this.#state.line; i < line; ++i) {
      this.#encodedRange += ";";
    }
  }
  #emitItemSepratorIfRequired() {
    if (this.#encodedRange !== "" && this.#encodedRange[this.#encodedRange.length - 1] !== ";") {
      this.#encodedRange += ",";
    }
  }
  build() {
    const result = this.#encodedRange;
    this.#state = {
      line: 0,
      column: 0,
      defSourceIdx: 0,
      defScopeIdx: 0,
      callsiteSourceIdx: 0,
      callsiteLine: 0,
      callsiteColumn: 0
    };
    this.#encodedRange = "";
    return result;
  }
}
