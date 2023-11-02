
/** @param {number|string} x */
function log(x) {
  console.log(x);
}

/** @param {number|string} x */
function inner(x) {
  log(x);
}

/** @param {number|string} x */
function outer(x) {
  inner(x);
}

outer(42);
outer('test');
