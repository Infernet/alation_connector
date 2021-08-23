import {IAlationUpdateBase} from '../interfaces';

export function prepareApiBody<T extends IAlationUpdateBase>(records: T): string;
export function prepareApiBody<T extends IAlationUpdateBase>(records: T[]): string[];
export function prepareApiBody<T extends IAlationUpdateBase>(records: T[] | T): string[] | string {
  if (Array.isArray(records)) {
    return records.map((r) => JSON.stringify(r));
  }

  return JSON.stringify(records);
}

export async function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export function sliceCollection<T = any>(array: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < Math.ceil(array.length / size); i++) {
    result[i] = array.slice((i * size), (i * size) + size);
  }

  return result;
}
