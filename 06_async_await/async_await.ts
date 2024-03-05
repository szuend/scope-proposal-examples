
async function addAndLog(x: Promise<number>, y: Promise<number>, z: Promise<number>) {
  const xValue = await x;
  const [yValue, zValue] = await Promise.all([y, z]);

  console.log(xValue + yValue + zValue);
}

addAndLog(Promise.resolve(42), Promise.resolve(21), Promise.resolve(5));