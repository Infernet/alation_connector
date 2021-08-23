import {AxiosInstance, AxiosPromise} from 'axios';
import {Alation, AlationEntityType} from '..';
import {
  ALATION_CATALOG_ROUTE,
  ALATION_NEXT_PAGE_HEADER_KEY,
  ALATION_UPDATE_ROUTE,
  alationCreateRoute,
  CUSTOM_FIELD_VALUE_EDIT_ROUTE,
  OBJECT_TYPE,
} from '../constants';
import {prepareApiBody, sliceCollection} from '../helpers';
import {
  IAbstractModel,
  IAlationEntity,
  IAlationUpdateBase,
  ICreateData,
  ICreateKey,
  ICreateRecord,
  IEditCustomFieldValue,
  IEditCustomFieldValueRequest,
  IEditCustomFieldValueResponse,
  IJob,
  IJobFinish,
  IPageResponse,
  IRequestConfig,
  IUpdateResponse,
} from '../interfaces';
import {AlationEntityId, AlationKey, Flag} from '../types';

export abstract class AbstractModel<Entity extends IAlationEntity, Update extends IAlationUpdateBase, CreateKey extends ICreateKey>
implements IAbstractModel<Entity, Update, CreateKey> {
  protected core: Alation;
  protected apiClient: AxiosInstance;
  protected entityType: AlationEntityType;

  protected constructor(core: Alation, apiClient: AxiosInstance, entityType: AlationEntityType) {
    this.core = core;
    this.apiClient = apiClient;
    this.entityType = entityType;
  }

  async getById<E extends Entity = Entity>(id: AlationEntityId): Promise<E | null> {
    try {
      const {data} = await this.apiClient.get<E[]>(ALATION_CATALOG_ROUTE[this.entityType], {params: {id}});

      return data.length ? data[0] : null;
    } catch (error) {
      console.error('CODE00000300 getById(): ' + error?.message);
      return null;
    }
  }

  async update<U extends IAlationUpdateBase = Update>(records: U, limit?: number): Promise<IUpdateResponse>;
  async update<U extends IAlationUpdateBase = Update>(records: U[], limit?: number): Promise<IUpdateResponse>;
  async update<U extends IAlationUpdateBase = Update>(records: U[] | U, limit = 100): Promise<IUpdateResponse> {
    try {
      if (Array.isArray(records)) {
        const pages = sliceCollection(prepareApiBody<U>(records), limit);
        let response: IUpdateResponse = {
          new_objects: 0,
          updated_objects: 0,
          number_received: 0,
          error: '',
          error_objects: [],
        };
        for (const page of pages) {
          const {data} = await this.apiClient.post<IUpdateResponse>(ALATION_UPDATE_ROUTE[this.entityType], page.join('\n'));
          response = {
            new_objects: response.new_objects + data.new_objects,
            updated_objects: response.updated_objects + data.updated_objects,
            number_received: response.number_received + data.number_received,
            error: response.error + data.error,
            error_objects: [...response.error_objects, ...data.error_objects],
          };
        }

        return response;
      } else {
        const body = prepareApiBody<U>(records);
        const {data} = await this.apiClient.post<IUpdateResponse>(ALATION_UPDATE_ROUTE[this.entityType], body);
        return data;
      }
    } catch (error) {
      console.error('CODE00000301 update(): ' + error?.message);
      throw error;
    }
  }

  async search<S, E extends Entity>(config: S): Promise<IPageResponse<E>>;
  async search<S, E extends Entity>(config: S, all: Flag): Promise<Array<E>>;
  async search<S, E extends Entity>(config: S, limit: number): Promise<IPageResponse<E>>;
  async search<S, E extends Entity>(config: S, limit: number, all: Flag): Promise<Array<E>>;
  async search<S, E extends Entity>(config: S, limit?: Flag | number, all?: Flag): Promise<E[] | IPageResponse<E>> {
    try {
      if (typeof limit === 'boolean' && limit) {
        return this.getAllData<E>({
          url: ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get',
          params: config,
        });
      }
      if (typeof limit === 'number' && limit > 0) {
        if (typeof all === 'boolean' && all) {
          return this.getAllData<E>({
            url: ALATION_CATALOG_ROUTE[this.entityType],
            method: 'get',
            params: {...config, limit},
          });
        }
        return this.getPagesData<E>({
          url: ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get',
          params: {...config, limit},
        });
      }
      return this.getPagesData<E>({
        url: ALATION_CATALOG_ROUTE[this.entityType],
        method: 'get',
        params: config,
      });
    } catch (error) {
      console.error('CODE00000302 search(): ' + error?.message);
      return [];
    }
  }

  async create<K extends CreateKey, D extends ICreateData>(dsId: number, key: K, data: D): Promise<IJob>;
  async create<K extends CreateKey, D extends ICreateData>(dsId: number, key: K, data: D, wait: Flag): Promise<IJobFinish>;
  async create<K extends CreateKey, D extends ICreateData>(dsId: number, entities: ICreateRecord<K, D>[]): Promise<IJob>;
  async create<K extends CreateKey, D extends ICreateData>(dsId: number, entities: ICreateRecord<K, D>[], wait: Flag): Promise<IJobFinish>;
  async create<K extends CreateKey, D extends ICreateData>(dsId: number, entities: ICreateRecord<K, D>[], limit: number): Promise<IJob[]>;
  async create<K extends CreateKey, D extends ICreateData>(dsId: number, entities: ICreateRecord<K, D>[], limit: number, wait: Flag): Promise<IJobFinish[]>;
  async create<K extends CreateKey, D extends ICreateData>(
      dsId: number, key: K | ICreateRecord<K, D>[], data?: D | Flag | number, wait?: Flag): Promise<IJob | IJobFinish | IJob[] | IJobFinish[]> {
    try {
      if (!Array.isArray(key)) {
        const entityKey = this.makeEntityKey(dsId, key);
        const entityData = data as D;

        const {data: job} = await this.apiClient.post<IJob>(alationCreateRoute(dsId), JSON.stringify({key: entityKey, ...entityData}));

        return wait ? this.core.getJobResult(job) : job;
      } else {
        const paramsCollection = key.map<string>(({key: k, data: d}) => (JSON.stringify({
          key: this.makeEntityKey(dsId, k),
          ...d,
        })));
        if (typeof data === 'boolean') {
          const {data: job} = await this.apiClient.post<IJob>(alationCreateRoute(dsId), paramsCollection.join('\n'));
          return this.core.getJobResult(job);
        }
        const pages = sliceCollection<string>(paramsCollection, data as number);

        const jobCollection: Array<IJob> = [];
        for (const page of pages) {
          const {data: job} = await this.apiClient.post<IJob>(alationCreateRoute(dsId), page.join('\n'));
          jobCollection.push(job);
        }

        if (typeof wait === 'boolean') {
          return await Promise.all<IJobFinish>(jobCollection.map<Promise<IJobFinish>>((job) => (this.core.getJobResult(job))));
        } else {
          return jobCollection;
        }
      }
    } catch (e) {
      console.error('CODE00000303 create(): ', e?.message);
      throw e;
    }
  }

  protected abstract makeEntityKey(datasourceId: number, key: CreateKey): AlationKey;

  protected async getAllData<E extends Entity = Entity>(config: IRequestConfig): Promise<Array<E>> {
    try {
      const result: Array<E> = [];

      let response = await this.getPagesData<E>(config);
      result.push(...response.values);

      while (response.next) {
        response = await response.next();
        result.push(...response.values);
      }

      return result;
    } catch (e) {
      console.error('CODE00000304 getAllData(): ', e?.message);
      throw e;
    }
  }

  protected async getPagesData<E extends Entity = Entity>(config: IRequestConfig): Promise<IPageResponse<E>> {
    try {
      const response = await (this.apiClient(config) as AxiosPromise<E[]>);
      const next: string | undefined = response?.headers[ALATION_NEXT_PAGE_HEADER_KEY];

      return {
        values: response.data,
        next: next ? () => (this.getPagesData({...config, url: next})) : null,
      };
    } catch (e) {
      console.error('CODE00000305 getPagesData(): ', e?.message);
      throw e;
    }
  }

  async updateCustomFields<V = any>(body: IEditCustomFieldValueRequest<V>): Promise<IEditCustomFieldValueResponse>;
  async updateCustomFields<V = any>(body: IEditCustomFieldValueRequest<V>[]): Promise<IEditCustomFieldValueResponse>;
  async updateCustomFields<V = any>(body: IEditCustomFieldValueRequest<V> | IEditCustomFieldValueRequest<V>[]): Promise<IEditCustomFieldValueResponse> {
    try {
      const otype = OBJECT_TYPE[this.entityType];
      let params: string;
      if (!Array.isArray(body)) {
        params = JSON.stringify(({...body, otype} as IEditCustomFieldValue));
      } else {
        params = body.map<string>((record) => JSON.stringify(({...record, otype} as IEditCustomFieldValue))).join('\n');
      }
      const {data} = await this.apiClient.post<IEditCustomFieldValueResponse>(CUSTOM_FIELD_VALUE_EDIT_ROUTE, params);
      return data;
    } catch (e) {
      console.error('CODE00000306 updateCustomFields(): ' + e?.message);
      throw e;
    }
  }
}


