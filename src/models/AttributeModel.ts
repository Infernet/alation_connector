import {AbstractModel} from '../classes';
import {IEntityModel, IModel} from '..';
import {AxiosInstance} from 'axios';
import {AlationEntityId, AlationKey, Flag} from '../types';
import {
  IAlationEntity,
  IAlationUpdateBase,
  ICreateData,
  ICreateKey,
  ICreateRecord,
  ICustomField,
  IJob,
  IJobFinish,
} from '../interfaces';
import {alationCreateRoute} from '../constants';
import {sliceCollection} from '../helpers';

export class AttributeModel<Entity extends IAttribute = IAttribute,
    Update extends IAttributeUpdate = IAttributeUpdate,
    Search extends IAttributeSearchParams = IAttributeSearchParams,
    CreateData extends IAttributeCreate = IAttributeCreate>
  extends AbstractModel<Entity, Update, Search, IAttributeKey, CreateData>
  implements IEntityModel<Entity, Update, Search, IAttributeKey, CreateData> {
  constructor(jobModel: IModel, apiClient: AxiosInstance) {
    super(jobModel, apiClient, 'attribute');
  }

  async create<CD extends CreateData = CreateData>(dsId: number, key: IAttributeKey, data: CD): Promise<IJob>;
  async create<CD extends CreateData = CreateData>(dsId: number, key: IAttributeKey, data: CD, wait: Flag): Promise<IJobFinish>;
  async create<CD extends CreateData = CreateData>(dsId: number, entities: ICreateRecord<IAttributeKey, CD>[]): Promise<IJob>;
  async create<CD extends CreateData = CreateData>(dsId: number, entities: ICreateRecord<IAttributeKey, CD>[], wait: Flag): Promise<IJobFinish>;
  async create<CD extends CreateData = CreateData>(dsId: number, entities: ICreateRecord<IAttributeKey, CD>[], limit: number): Promise<IJob[]>;
  async create<CD extends CreateData = CreateData>(dsId: number, entities: ICreateRecord<IAttributeKey, CD>[], limit: number, wait: Flag):
      Promise<IJobFinish[]>;
  async create<CD extends CreateData = CreateData>(
      dsId: number,
      key: IAttributeKey | ICreateRecord<IAttributeKey, CD>[],
      data?: CD | Flag | number,
      wait?: Flag): Promise<IJob | IJobFinish | IJob[] | IJobFinish[]> {
    if (!Array.isArray(key)) {
      const requestData = [
        JSON.stringify({key: this.makeTableEntityKey(dsId, key)}),
        JSON.stringify({key: this.makeEntityKey(dsId, key), ...(data as CD)}),
      ].join('\n');

      const {data: job} = await this.apiClient.post<IJob>(alationCreateRoute(dsId), requestData);

      return wait ? this.core.getJobResult(job) : job;
    } else {
      if (typeof data !== 'number') {
        const requestData = key.map<string[]>(({key: k, data: d}) => {
          return [
            JSON.stringify({key: this.makeTableEntityKey(dsId, k)}),
            JSON.stringify({key: this.makeEntityKey(dsId, k), ...(d as CD)}),
          ];
        }).flat().join('\n');
        const {data: job} = await this.apiClient.post<IJob>(alationCreateRoute(dsId), requestData);
        if (typeof data === 'boolean' && data) {
          return this.core.getJobResult(job);
        }
        return job;
      }
      const requestPages: string[] = [];

      for (const page of sliceCollection<ICreateRecord<IAttributeKey, CreateData>>(key, data)) {
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

export type IAttributeSearchParams = {
  'id'?: AlationEntityId;
  'ds_id'?: AlationEntityId;
  'schema_id'?: AlationEntityId;
  'table_id'?: AlationEntityId;
  'title'?: string;
  'name'?: string;
  'schema_name'?: string;
  'table_name'?: string;
}

export type IAttributeCreate<CustomFields extends ICustomField = ICustomField> = ICreateData & Omit<IAttributeUpdate<CustomFields>, 'key'>;
