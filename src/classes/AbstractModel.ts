import {AxiosInstance} from 'axios';
import {AlationEntityType, IEntityModel, IModel} from '..';
import {ALATION_CATALOG_ROUTE, ALATION_UPDATE_ROUTE, alationCreateRoute} from '../constants';
import {prepareApiBody, sliceCollection} from '../helpers';
import {
  IAlationEntity,
  IAlationUpdateBase,
  ICreateData,
  ICreateKey,
  ICreateRecord,
  IJob,
  IJobFinish,
  IPageResponse,
  IUpdateResponse,
} from '../interfaces';
import {AlationEntityId, AlationKey, Flag} from '../types';

export abstract class AbstractModel<Entity extends IAlationEntity,
    Update extends IAlationUpdateBase,
    Search,
    CreateKey extends ICreateKey,
    CreateData extends ICreateData>
implements IEntityModel<Entity, Update, Search, CreateKey, CreateData> {
  protected core: IModel;
  protected apiClient: AxiosInstance;
  protected entityType: AlationEntityType;

  protected constructor(core: IModel, apiClient: AxiosInstance, entityType: AlationEntityType) {
    this.core = core;
    this.apiClient = apiClient;
    this.entityType = entityType;

    // публичные методы
    this.getById = this.getById.bind(this);
    this.search = this.search.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    // вспомогательные методы
    this.makeEntityKey = this.makeEntityKey.bind(this);
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

  async update<U extends Update = Update>(records: U, limit?: number): Promise<IUpdateResponse>;
  async update<U extends Update = Update>(records: U[], limit?: number): Promise<IUpdateResponse>;
  async update<U extends Update = Update>(records: U[] | U, limit = 100): Promise<IUpdateResponse> {
    try {
      if (Array.isArray(records)) {
        const pages = sliceCollection(prepareApiBody<Update>(records), limit);
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
        const body = prepareApiBody<Update>(records);
        const {data} = await this.apiClient.post<IUpdateResponse>(ALATION_UPDATE_ROUTE[this.entityType], body);
        return data;
      }
    } catch (error) {
      console.error('CODE00000301 update(): ' + error?.message);
      throw error;
    }
  }

  async search<E extends Entity = Entity, S extends Search = Search>(config?: S): Promise<IPageResponse<E>>;
  async search<E extends Entity = Entity, S extends Search = Search>(config: S, all: Flag): Promise<Array<E>>;
  async search<E extends Entity = Entity, S extends Search = Search>(config: S, limit: number): Promise<IPageResponse<E>>;
  async search<E extends Entity = Entity, S extends Search = Search>(config: S, limit: number, all: Flag): Promise<Array<E>>;
  async search<E extends Entity = Entity, S extends Search = Search>(config?: S, limit?: Flag | number, all?: Flag): Promise<E[] | IPageResponse<E>> {
    try {
      if (!config) {
        return this.core.getAllData({
          url: ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get',
        });
      }
      if (typeof limit === 'boolean' && limit) {
        return this.core.getAllData<E>({
          url: ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get',
          params: config,
        });
      }
      if (typeof limit === 'number' && limit > 0) {
        if (typeof all === 'boolean' && all) {
          return this.core.getAllData<E>({
            url: ALATION_CATALOG_ROUTE[this.entityType],
            method: 'get',
            params: {...config, limit},
          });
        }
        return this.core.getPagesData<E>({
          url: ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get',
          params: {...config, limit},
        });
      }
      return this.core.getPagesData<E>({
        url: ALATION_CATALOG_ROUTE[this.entityType],
        method: 'get',
        params: config,
      });
    } catch (error) {
      console.error('CODE00000302 search(): ' + error?.message);
      return [];
    }
  }

  async create<CD extends CreateData = CreateData>(dsId: number, key: CreateKey, data: CD): Promise<IJob>;
  async create<CD extends CreateData = CreateData>(dsId: number, key: CreateKey, data: CD, wait: Flag): Promise<IJobFinish>;
  async create<CD extends CreateData = CreateData>(dsId: number, entities: ICreateRecord<CreateKey, CD>[]): Promise<IJob>;
  async create<CD extends CreateData = CreateData>(dsId: number, entities: ICreateRecord<CreateKey, CD>[], wait: Flag): Promise<IJobFinish>;
  async create<CD extends CreateData = CreateData>(dsId: number, entities: ICreateRecord<CreateKey, CD>[], limit: number): Promise<IJob[]>;
  async create<CD extends CreateData = CreateData>(dsId: number, entities: ICreateRecord<CreateKey, CD>[], limit: number, wait: Flag): Promise<IJobFinish[]>;
  async create<CD extends CreateData = CreateData>(dsId: number,
      key: CreateKey | ICreateRecord<CreateKey, CD>[],
      data?: CD | Flag | number,
      wait?: Flag): Promise<IJob | IJobFinish | IJob[] | IJobFinish[]> {
    try {
      if (!Array.isArray(key)) {
        const entityKey = this.makeEntityKey(dsId, key);
        const entityData = data as CD;

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
}

