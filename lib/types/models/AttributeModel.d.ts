import { AbstractModel } from '../classes';
import { IEntityModel, IModel } from '..';
import { AxiosInstance } from 'axios';
import { AlationEntityId, AlationKey, Flag } from '../types';
import { IAlationEntity, IAlationUpdateBase, ICreateData, ICreateKey, ICreateRecord, ICustomField, IJob, IJobFinish } from '../interfaces';
export declare class AttributeModel<Entity extends IAttribute = IAttribute, Update extends IAttributeUpdate = IAttributeUpdate, Search extends IAttributeSearchParams = IAttributeSearchParams, CreateData extends IAttributeCreate = IAttributeCreate> extends AbstractModel<Entity, Update, Search, IAttributeKey, CreateData> implements IEntityModel<Entity, Update, Search, IAttributeKey, CreateData> {
    constructor(jobModel: IModel, apiClient: AxiosInstance);
    create<CD extends CreateData = CreateData>(dsId: number, key: IAttributeKey, data: CD): Promise<IJob>;
    create<CD extends CreateData = CreateData>(dsId: number, key: IAttributeKey, data: CD, wait: Flag): Promise<IJobFinish>;
    create<CD extends CreateData = CreateData>(dsId: number, entities: ICreateRecord<IAttributeKey, CD>[]): Promise<IJob>;
    create<CD extends CreateData = CreateData>(dsId: number, entities: ICreateRecord<IAttributeKey, CD>[], wait: Flag): Promise<IJobFinish>;
    create<CD extends CreateData = CreateData>(dsId: number, entities: ICreateRecord<IAttributeKey, CD>[], limit: number): Promise<IJob[]>;
    create<CD extends CreateData = CreateData>(dsId: number, entities: ICreateRecord<IAttributeKey, CD>[], limit: number, wait: Flag): Promise<IJobFinish[]>;
    protected makeEntityKey(datasourceId: number, key: IAttributeKey): AlationKey;
    protected makeTableEntityKey(datasourceId: number, key: IAttributeKey): AlationKey;
}
export interface IAttribute<CustomFields extends ICustomField = ICustomField> extends IAlationEntity {
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
    'title': string;
    'description': string;
    'url': string;
    'custom_fields': Array<CustomFields>;
}
export interface IAttributeUpdate<CustomFields extends ICustomField = ICustomField> extends IAlationUpdateBase {
    'key': AlationKey;
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
export interface IAttributeKey extends Required<ICreateKey> {
    'schema_name': string;
    'table_name': string;
    'name': string;
}
export declare type IAttributeSearchParams = {
    'id'?: AlationEntityId;
    'ds_id'?: AlationEntityId;
    'schema_id'?: AlationEntityId;
    'table_id'?: AlationEntityId;
    'title'?: string;
    'name'?: string;
    'schema_name'?: string;
    'table_name'?: string;
};
export declare type IAttributeCreate<CustomFields extends ICustomField = ICustomField> = ICreateData & Omit<IAttributeUpdate<CustomFields>, 'key'>;
//# sourceMappingURL=AttributeModel.d.ts.map