import {AbstractModel} from '../classes';
import {IEntityModel, IModel} from '../index';
import {AxiosInstance} from 'axios';
import {AlationEntityId, AlationKey} from '../types';
import {IAlationEntity, IAlationUpdateBase, ICreateData, ICreateKey, ICustomField} from '../interfaces';

export class SchemaModel<Entity extends ISchema = ISchema,
    Update extends ISchemaUpdate = ISchemaUpdate,
    Search extends ISchemaSearchParams = ISchemaSearchParams,
    CreateData extends ISchemaCreate = ISchemaCreate>
  extends AbstractModel<Entity, Update, Search, ISchemaKey, CreateData>
  implements IEntityModel<Entity, Update, Search, ISchemaKey, CreateData> {
  constructor(jobModel: IModel, apiClient: AxiosInstance) {
    super(jobModel, apiClient, 'schema');
  }

  protected makeEntityKey(datasourceId: number, key: ISchemaKey): AlationKey {
    return `${datasourceId}.${key.name}`;
  }
}

export interface ISchema<CustomFields extends ICustomField = ICustomField> extends IAlationEntity {
  'ds_id': AlationEntityId;
  'name': string;
  'db_comment': null | string;
  'title': string;
  'description': string;
  'url': string;
  'custom_fields': Array<CustomFields>;
}

export interface ISchemaUpdate<CustomFields extends ICustomField = ICustomField> extends IAlationUpdateBase {
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

export interface ISchemaKey extends Required<ICreateKey> {
  'name': string;
}

export type ISchemaSearchParams = {
  'id'?: AlationEntityId;
  'ds_id'?: AlationEntityId;
  'title'?: string;
  'name'?: string;
}

export type ISchemaCreate<CustomFields extends ICustomField = ICustomField> = ICreateData & Omit<ISchemaUpdate<CustomFields>, 'key'>;
