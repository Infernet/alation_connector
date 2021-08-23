"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareApiBody = prepareApiBody;
exports.sleep = sleep;
exports.sliceCollection = sliceCollection;

function prepareApiBody(records) {
  if (Array.isArray(records)) {
    return records.map(r => JSON.stringify(r));
  }

  return JSON.stringify(records);
}

async function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

function sliceCollection(array, size) {
  const result = [];

  for (let i = 0; i < Math.ceil(array.length / size); i++) {
    result[i] = array.slice(i * size, i * size + size);
  }

  return result;
}
//# sourceMappingURL=index.js.map