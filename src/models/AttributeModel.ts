import {AbstractModel} from '../classes';
import {Alation} from '..';
import {AxiosInstance} from 'axios';
import {AlationEntityId, AlationKey, Flag} from '../types';
import {IAlationEntity, IAlationUpdateBase, ICreateData, ICreateKey, ICreateRecord, ICustomField, IJob, IJobFinish, IPageResponse} from '../interfaces';
import {alationCreateRoute} from '../constants';
import {sliceCollection} from '../helpers';

export class AttributeModel<Entity extends IAttribute = IAttribute, Update extends IAttributeUpdate = IAttributeUpdate>
  extends AbstractModel<Entity, Update, IAttributeKey> {
  constructor(core: Alation, apiClient: AxiosInstance) {
    super(core, apiClient, 'attribute');

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

  async search<S extends IAttributeSearchParams, E extends Entity = Entity>(config: S): Promise<IPageResponse<E>>;
  async search<S extends IAttributeSearchParams, E extends Entity = Entity>(config: S, all: Flag): Promise<Array<E>>;
  async search<S extends IAttributeSearchParams, E extends Entity = Entity>(config: S, limit: number): Promise<IPageResponse<E>>;
  async search<S extends IAttributeSearchParams, E extends Entity = Entity>(config: S, limit: number, all: Flag): Promise<Array<E>>;
  async search<S extends IAttributeSearchParams, E extends Entity = Entity>(config: S, limit?: Flag | number, all?: Flag): Promise<E[] | IPageResponse<E>> {
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

  async create<K extends IAttributeKey, D extends IAttributeCreate>(dsId: number, key: K, data: D): Promise<IJob>;
  async create<K extends IAttributeKey, D extends IAttributeCreate>(dsId: number, key: K, data: D, wait: Flag): Promise<IJobFinish>;
  async create<K extends IAttributeKey, D extends IAttributeCreate>(dsId: number, entities: ICreateRecord<K, D>[]): Promise<IJob>;
  async create<K extends IAttributeKey, D extends IAttributeCreate>(dsId: number, entities: ICreateRecord<K, D>[], wait: Flag): Promise<IJobFinish>;
  async create<K extends IAttributeKey, D extends IAttributeCreate>(dsId: number, entities: ICreateRecord<K, D>[], limit: number): Promise<IJob[]>;
  async create<K extends IAttributeKey, D extends IAttributeCreate>(dsId: number, entities: ICreateRecord<K, D>[], limit: number, wait: Flag):
      Promise<IJobFinish[]>;
  async create<K extends IAttributeKey, D extends IAttributeCreate>(
      dsId: number,
      key: K | ICreateRecord<K, D>[],
      data?: D | Flag | number,
      wait?: Flag): Promise<IJob | IJobFinish | IJob[] | IJobFinish[]> {
    if (!Array.isArray(key)) {
      const requestData = [
        JSON.stringify({key: this.makeTableEntityKey(dsId, key)}),
        JSON.stringify({key: this.makeEntityKey(dsId, key), ...(data as D)}),
      ].join('\n');

      const {data: job} = await this.apiClient.post<IJob>(alationCreateRoute(dsId), requestData);

      return wait ? this.core.getJobResult(job) : job;
    } else {
      if (typeof data !== 'number') {
        const requestData = key.map<string[]>(({key: k, data: d}) => {
          return [
            JSON.stringify({key: this.makeTableEntityKey(dsId, k)}),
            JSON.stringify({key: this.makeEntityKey(dsId, k), ...(d as D)}),
          ];
        }).flat().join('\n');
        const {data: job} = await this.apiClient.post<IJob>(alationCreateRoute(dsId), requestData);
        if (typeof data === 'boolean' && data) {
          return this.core.getJobResult(job);
        }
        return job;
      }
      const requestPages: string[] = [];

      for (const page of sliceCollection<ICreateRecord<K, D>>(key, data)) {
        const formattedPage: string[][] = [];
        for (const record of page) {
          formattedPage.push([
            JSON.stringify({key: this.makeTableEntityKey(dsId, record.key)}),
            JSON.stringify({key: this.makeEntityKey(dsId, record.key), ...record.data}),
          ]);
        }
        requestPages.push(formattedPage.flat().join('\n'));
      }

      const jobCollection: Array<IJob> = [];
      for (const request of requestPages) {
        const {data: job} = await this.apiClient.post<IJob>(alationCreateRoute(dsId), request);
        jobCollection.push(job);
      }

      if (typeof wait === 'boolean' && wait) {
        return await Promise.all<IJobFinish>(jobCollection.map<Promise<IJobFinish>>((job) => (this.core.getJobResult(job))));
      }
      return jobCollection;
    }
  }

  protected makeEntityKey(datasourceId: number, key: IAttributeKey): AlationKey {
    return `${this.makeTableEntityKey(datasourceId, key)}.${key.name}`;
  }

  protected makeTableEntityKey(datasourceId: number, key: IAttributeKey): AlationKey {
    return `${datasourceId}.${key.schema_name}.${key.table_name}`;
  }
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

export type IAttributeSearchParams = {
  'id'?: AlationEntityId;
  'ds_id'?: number;
  'schema_id'?: number;
  'table_id'?: number;
  'title'?: string;
  'name'?: string;
  'schema_name'?: string;
  'table_name'?: string;
}

export type IAttributeCreate<CustomFields extends ICustomField = ICustomField> = ICreateData & Omit<IAttributeUpdate<CustomFields>, 'key'>;
