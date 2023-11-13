
const CALL_CHANCE = 0.5;

function log(x) {
  console.log(x);
}

function inner(x) {
  log(x);
}

function outer(x) {
  const shouldCall = Math.random() < CALL_CHANCE;
  console.log('Do we log?', shouldCall);
  if (shouldCall) {
    inner(x);
  }
}

outer(42);
outer(null);
