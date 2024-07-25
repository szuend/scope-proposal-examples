
/** @param {number|string} x */
function log(x) {
  console.log(x);
}

/** @param {number|string} y */
function inner(y) {
  log(y);
}

/** @param {number|string} z */
function outer(z) {
  inner(z);
}

outer(42);
outer('test');
