
async function logPromise(x: Promise<number>) {
  const result = await x;
  console.log(result);
}

logPromise(Promise.resolve(42));