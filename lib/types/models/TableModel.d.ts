import { AbstractModel } from '../classes';
import { IEntityModel, IModel } from '../index';
import { AxiosInstance } from 'axios';
import { AlationEntityId, AlationKey } from '../types';
import { IAlationEntity, IAlationUpdateBase, ICreateData, ICreateKey, ICustomField } from '../interfaces';
export declare class TableModel<Entity extends ITable = ITable, Update extends ITableUpdate = ITableUpdate, Search extends ITableSearchParams = ITableSearchParams, CreateData extends ITableCreate = ITableCreate> extends AbstractModel<Entity, Update, Search, ITableKey, CreateData> implements IEntityModel<Entity, Update, Search, ITableKey, CreateData> {
    constructor(jobModel: IModel, apiClient: AxiosInstance);
    protected makeEntityKey(datasourceId: number, key: ITableKey): AlationKey;
}
export interface ITable<CustomFields extends ICustomField = ICustomField> extends IAlationEntity {
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
    'title': string;
    'description': string;
    'url': string;
    'custom_fields': Array<CustomFields>;
}
export interface ITableUpdate<CustomFields extends ICustomField = ICustomField> extends IAlationUpdateBase {
    'key': AlationKey;
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
export interface ITableKey extends Required<ICreateKey> {
    'schema_name': string;
    'name': string;
}
export declare type ITableSearchParams = {
    'id'?: AlationEntityId;
    'ds_id'?: AlationEntityId;
    'schema_id'?: AlationEntityId;
    'schema_name'?: string;
    'title'?: string;
    'name'?: string;
};
export declare type ITableCreate<CustomFields extends ICustomField = ICustomField> = ICreateData & Omit<ITableUpdate<CustomFields>, 'key'>;
//# sourceMappingURL=TableModel.d.ts.map