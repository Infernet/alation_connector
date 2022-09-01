import { IAlationUpdateBase } from '../interfaces';
export declare function prepareApiBody<T extends IAlationUpdateBase>(records: T): string;
export declare function prepareApiBody<T extends IAlationUpdateBase>(records: T[]): string[];
export declare function sleep(timeout: number): Promise<void>;
export declare function sliceCollection<T = any>(array: T[], size: number): T[][];
//# sourceMappingURL=index.d.ts.map