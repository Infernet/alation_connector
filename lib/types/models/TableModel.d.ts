import { AbstractModel } from '../classes';
import { Alation } from '../index';
import { AxiosInstance } from 'axios';
import { AlationEntityId, AlationKey, Flag } from '../types';
import { IAlationEntity, IAlationUpdateBase, ICreateData, ICreateKey, ICreateRecord, ICustomField, IJob, IJobFinish, IPageResponse } from '../interfaces';
export declare class TableModel<Entity extends ITable = ITable, Update extends ITableUpdate = ITableUpdate> extends AbstractModel<Entity, Update, ITableKey> {
    constructor(core: Alation, apiClient: AxiosInstance);
    search<S extends ITableSearchParams, E extends Entity = Entity>(config: S): Promise<IPageResponse<E>>;
    search<S extends ITableSearchParams, E extends Entity = Entity>(config: S, all: Flag): Promise<Array<E>>;
    search<S extends ITableSearchParams, E extends Entity = Entity>(config: S, limit: number): Promise<IPageResponse<E>>;
    search<S extends ITableSearchParams, E extends Entity = Entity>(config: S, limit: number, all: Flag): Promise<Array<E>>;
    create<K extends ITableKey, D extends ITableCreate>(dsId: number, key: K, data: D): Promise<IJob>;
    create<K extends ITableKey, D extends ITableCreate>(dsId: number, key: K, data: D, wait: Flag): Promise<IJobFinish>;
    create<K extends ITableKey, D extends ITableCreate>(dsId: number, entities: ICreateRecord<K, D>[]): Promise<IJob>;
    create<K extends ITableKey, D extends ITableCreate>(dsId: number, entities: ICreateRecord<K, D>[], wait: Flag): Promise<IJobFinish>;
    create<K extends ITableKey, D extends ITableCreate>(dsId: number, entities: ICreateRecord<K, D>[], limit: number): Promise<IJob[]>;
    create<K extends ITableKey, D extends ITableCreate>(dsId: number, entities: ICreateRecord<K, D>[], limit: number, wait: Flag): Promise<IJobFinish[]>;
    protected makeEntityKey(datasourceId: number, key: ITableKey): AlationKey;
}
export interface ITable<CustomFields extends ICustomField = ICustomField> extends IAlationEntity<CustomFields> {
    'ds_id': AlationEntityId;
    'schema_id': AlationEntityId;
    'db_table_type': null | string;
    'is_view': boolean;
    'is_synonym': boolean;
    'name': string;
    'schema_name': string;
    'synonyms': null | string;
    'base_table': null | string;
    'db_comment': null | string;
}
export interface ITableUpdate<CustomFields extends ICustomField = ICustomField> extends IAlationUpdateBase {
    'title'?: string;
    'name'?: string;
    'description'?: string;
    'data_type'?: string;
    'db_comment'?: string | null;
    'is_primary_key'?: boolean;
    'is_foreign_key'?: boolean;
    'nullable'?: boolean;
    'db_table_type'?: null | string;
    'is_view'?: boolean;
    'is_synonym'?: boolean;
    'synonyms'?: null | string;
    'base_table'?: null | string;
    'custom_fields'?: CustomFields[];
}
export interface ITableKey extends ICreateKey {
    'schema_name': string;
    'name': string;
}
export declare type ITableSearchParams = {
    'id'?: AlationEntityId;
    'ds_id'?: number;
    'schema_id'?: number;
    'schema_name'?: string;
    'title'?: string;
    'name'?: string;
};
export declare type ITableCreate<CustomFields extends ICustomField = ICustomField> = ICreateData & Omit<ITableUpdate<CustomFields>, 'key'>;
//# sourceMappingURL=TableModel.d.ts.map