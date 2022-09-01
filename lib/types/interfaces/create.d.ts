import { AlationEntityId } from '../types';
export interface ICreateData {
}
export interface ICreateKey {
    'ds_id'?: AlationEntityId;
}
export interface ICreateRecord<K extends ICreateKey, D extends ICreateData> {
    key: K;
    data: D;
}
//# sourceMappingURL=create.d.ts.map