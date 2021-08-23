import {AbstractModel} from '../classes';
import {Alation} from '../index';
import {AxiosInstance} from 'axios';
import {AlationEntityId, AlationKey, Flag} from '../types';
import {IAlationEntity, IAlationUpdateBase, ICreateData, ICreateKey, ICreateRecord, ICustomField, IJob, IJobFinish, IPageResponse} from '../interfaces';

export class SchemaModel<Entity extends ISchema = ISchema, Update extends ISchemaUpdate = ISchemaUpdate>
  extends AbstractModel<Entity, Update, ISchemaKey> {
  constructor(core: Alation, apiClient: AxiosInstance) {
    super(core, apiClient, 'schema');

    // публичные методы
    this.getById = this.getById.bind(this);
    this.search = this.search.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    // вспомогательные методы
    this.makeEntityKey = this.makeEntityKey.bind(this);
    this.getAllData = this.getAllData.bind(this);
    this.getPagesData = this.getPagesData.bind(this);
  }

  async search<S extends ISchemaSearchParams, E extends Entity = Entity>(config: S): Promise<IPageResponse<E>>;
  async search<S extends ISchemaSearchParams, E extends Entity = Entity>(config: S, all: Flag): Promise<Array<E>>;
  async search<S extends ISchemaSearchParams, E extends Entity = Entity>(config: S, limit: number): Promise<IPageResponse<E>>;
  async search<S extends ISchemaSearchParams, E extends Entity = Entity>(config: S, limit: number, all: Flag): Promise<Array<E>>;
  async search<S extends ISchemaSearchParams, E extends Entity = Entity>(config: S, limit?: Flag | number, all?: Flag): Promise<E[] | IPageResponse<E>> {
    if (typeof limit === 'boolean' && limit) {
      return super.search<S, E>(config, limit);
    }
    if (typeof limit === 'number' && limit > 0) {
      if (typeof all === 'boolean' && all) {
        return super.search<S, E>(config, limit, all);
      }
      return super.search<S, E>(config, limit);
    }
    return super.search<S, E>(config);
  }

  async create<K extends ISchemaKey, D extends ISchemaCreate>(dsId: number, key: K, data: D): Promise<IJob>;
  async create<K extends ISchemaKey, D extends ISchemaCreate>(dsId: number, key: K, data: D, wait: Flag): Promise<IJobFinish>;
  async create<K extends ISchemaKey, D extends ISchemaCreate>(dsId: number, entities: ICreateRecord<K, D>[]): Promise<IJob>;
  async create<K extends ISchemaKey, D extends ISchemaCreate>(dsId: number, entities: ICreateRecord<K, D>[], wait: Flag): Promise<IJobFinish>;
  async create<K extends ISchemaKey, D extends ISchemaCreate>(dsId: number, entities: ICreateRecord<K, D>[], limit: number): Promise<IJob[]>;
  async create<K extends ISchemaKey, D extends ISchemaCreate>(dsId: number, entities: ICreateRecord<K, D>[], limit: number, wait: Flag): Promise<IJobFinish[]>;
  async create<K extends ISchemaKey, D extends ISchemaCreate>(
      dsId: number,
      key: K | ICreateRecord<K, D>[],
      data?: D | Flag | number,
      wait?: Flag): Promise<IJob | IJobFinish | IJob[] | IJobFinish[]> {
    if (!Array.isArray(key)) {
      if (typeof wait === 'boolean' && wait) {
        return super.create<K, D>(dsId, key, data as D, wait);
      }
      return super.create<K, D>(dsId, key, data as D);
    }
    if (typeof data === 'boolean' && data) {
      return super.create<K, D>(dsId, key, data);
    }
    if (typeof wait === 'boolean' && wait) {
      return super.create<K, D>(dsId, key, (data as number), wait);
    } else {
      return super.create<K, D>(dsId, key, (data as number));
    }
  }

  protected makeEntityKey(datasourceId: number, key: ISchemaKey): AlationKey {
    return `${datasourceId}.${key.name}`;
  }
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

export type ISchemaSearchParams = {
  'id'?: AlationEntityId;
  'ds_id'?: number;
  'title'?: string;
  'name'?: string;
}

export type ISchemaCreate<CustomFields extends ICustomField = ICustomField> = ICreateData & Omit<ISchemaUpdate<CustomFields>, 'key'>;
