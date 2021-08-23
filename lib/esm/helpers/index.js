export function prepareApiBody(records) {
  if (Array.isArray(records)) {
    return records.map(r => JSON.stringify(r));
  }

  return JSON.stringify(records);
}
export async function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
export function sliceCollection(array, size) {
  const result = [];

  for (let i = 0; i < Math.ceil(array.length / size); i++) {
    result[i] = array.slice(i * size, i * size + size);
  }

  return result;
}
//# sourceMappingURL=index.js.map