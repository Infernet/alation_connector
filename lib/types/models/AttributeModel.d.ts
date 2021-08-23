import { AbstractModel } from '../classes';
import { Alation } from '..';
import { AxiosInstance } from 'axios';
import { AlationEntityId, AlationKey, Flag } from '../types';
import { IAlationEntity, IAlationUpdateBase, ICreateData, ICreateKey, ICreateRecord, ICustomField, IJob, IJobFinish, IPageResponse } from '../interfaces';
export declare class AttributeModel<Entity extends IAttribute = IAttribute, Update extends IAttributeUpdate = IAttributeUpdate> extends AbstractModel<Entity, Update, IAttributeKey> {
    constructor(core: Alation, apiClient: AxiosInstance);
    search<S extends IAttributeSearchParams, E extends Entity = Entity>(config: S): Promise<IPageResponse<E>>;
    search<S extends IAttributeSearchParams, E extends Entity = Entity>(config: S, all: Flag): Promise<Array<E>>;
    search<S extends IAttributeSearchParams, E extends Entity = Entity>(config: S, limit: number): Promise<IPageResponse<E>>;
    search<S extends IAttributeSearchParams, E extends Entity = Entity>(config: S, limit: number, all: Flag): Promise<Array<E>>;
    create<K extends IAttributeKey, D extends IAttributeCreate>(dsId: number, key: K, data: D): Promise<IJob>;
    create<K extends IAttributeKey, D extends IAttributeCreate>(dsId: number, key: K, data: D, wait: Flag): Promise<IJobFinish>;
    create<K extends IAttributeKey, D extends IAttributeCreate>(dsId: number, entities: ICreateRecord<K, D>[]): Promise<IJob>;
    create<K extends IAttributeKey, D extends IAttributeCreate>(dsId: number, entities: ICreateRecord<K, D>[], wait: Flag): Promise<IJobFinish>;
    create<K extends IAttributeKey, D extends IAttributeCreate>(dsId: number, entities: ICreateRecord<K, D>[], limit: number): Promise<IJob[]>;
    create<K extends IAttributeKey, D extends IAttributeCreate>(dsId: number, entities: ICreateRecord<K, D>[], limit: number, wait: Flag): Promise<IJobFinish[]>;
    protected makeEntityKey(datasourceId: number, key: IAttributeKey): AlationKey;
    protected makeTableEntityKey(datasourceId: number, key: IAttributeKey): AlationKey;
}
export interface IAttribute<CustomFields extends ICustomField = ICustomField> extends IAlationEntity<CustomFields> {
    'name': string;
    'ds_id': AlationEntityId;
    'schema_id': AlationEntityId;
    'table_id': AlationEntityId;
    'table_name': string;
    'data_type': string;
    'db_comment': null | any;
    'is_primary_key': boolean;
    'is_foreign_key': boolean;
    'nullable': boolean;
}
export interface IAttributeUpdate<CustomFields extends ICustomField = ICustomField> extends IAlationUpdateBase {
    'title'?: string;
    'name'?: string;
    'description'?: string;
    'data_type'?: string;
    'db_comment'?: string | null;
    'is_primary_key'?: boolean;
    'is_foreign_key'?: boolean;
    'nullable'?: boolean;
    'custom_fields'?: CustomFields[];
}
export interface IAttributeKey extends ICreateKey {
    'schema_name': string;
    'table_name': string;
    'name': string;
}
export declare type IAttributeSearchParams = {
    'id'?: AlationEntityId;
    'ds_id'?: number;
    'schema_id'?: number;
    'table_id'?: number;
    'title'?: string;
    'name'?: string;
    'schema_name'?: string;
    'table_name'?: string;
};
export declare type IAttributeCreate<CustomFields extends ICustomField = ICustomField> = ICreateData & Omit<IAttributeUpdate<CustomFields>, 'key'>;
//# sourceMappingURL=AttributeModel.d.ts.map