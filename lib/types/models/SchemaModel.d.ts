import { AbstractModel } from '../classes';
import { Alation } from '../index';
import { AxiosInstance } from 'axios';
import { AlationEntityId, AlationKey, Flag } from '../types';
import { IAlationEntity, IAlationUpdateBase, ICreateData, ICreateKey, ICreateRecord, ICustomField, IJob, IJobFinish, IPageResponse } from '../interfaces';
export declare class SchemaModel<Entity extends ISchema = ISchema, Update extends ISchemaUpdate = ISchemaUpdate> extends AbstractModel<Entity, Update, ISchemaKey> {
    constructor(core: Alation, apiClient: AxiosInstance);
    search<S extends ISchemaSearchParams, E extends Entity = Entity>(config: S): Promise<IPageResponse<E>>;
    search<S extends ISchemaSearchParams, E extends Entity = Entity>(config: S, all: Flag): Promise<Array<E>>;
    search<S extends ISchemaSearchParams, E extends Entity = Entity>(config: S, limit: number): Promise<IPageResponse<E>>;
    search<S extends ISchemaSearchParams, E extends Entity = Entity>(config: S, limit: number, all: Flag): Promise<Array<E>>;
    create<K extends ISchemaKey, D extends ISchemaCreate>(dsId: number, key: K, data: D): Promise<IJob>;
    create<K extends ISchemaKey, D extends ISchemaCreate>(dsId: number, key: K, data: D, wait: Flag): Promise<IJobFinish>;
    create<K extends ISchemaKey, D extends ISchemaCreate>(dsId: number, entities: ICreateRecord<K, D>[]): Promise<IJob>;
    create<K extends ISchemaKey, D extends ISchemaCreate>(dsId: number, entities: ICreateRecord<K, D>[], wait: Flag): Promise<IJobFinish>;
    create<K extends ISchemaKey, D extends ISchemaCreate>(dsId: number, entities: ICreateRecord<K, D>[], limit: number): Promise<IJob[]>;
    create<K extends ISchemaKey, D extends ISchemaCreate>(dsId: number, entities: ICreateRecord<K, D>[], limit: number, wait: Flag): Promise<IJobFinish[]>;
    protected makeEntityKey(datasourceId: number, key: ISchemaKey): AlationKey;
}
export interface ISchema<CustomFields extends ICustomField = ICustomField> extends IAlationEntity<CustomFields> {
    'ds_id': AlationEntityId;
    'name': string;
    'db_comment': null | string;
}
export interface ISchemaUpdate<CustomFields extends ICustomField = ICustomField> extends IAlationUpdateBase {
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
export interface ISchemaKey extends ICreateKey {
    'name': string;
}
export declare type ISchemaSearchParams = {
    'id'?: AlationEntityId;
    'ds_id'?: number;
    'title'?: string;
    'name'?: string;
};
export declare type ISchemaCreate<CustomFields extends ICustomField = ICustomField> = ICreateData & Omit<ISchemaUpdate<CustomFields>, 'key'>;
//# sourceMappingURL=SchemaModel.d.ts.map