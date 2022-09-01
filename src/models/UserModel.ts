import {AlationEntityId, Flag, IAlationEntity, IModel, IPageResponse} from 'src';
import {AxiosInstance} from 'axios';

export class UserModel<Entity extends IUser = IUser,
    Search extends IUserSearch = IUserSearch> {
  protected core: IModel;
  protected apiClient: AxiosInstance;

  constructor(jobModel: IModel, apiClient: AxiosInstance) {
    this.core = jobModel;
    this.apiClient = apiClient;
  }

  async getById<E extends Entity = Entity>(id: AlationEntityId): Promise<E | null> {
    try {
      const {data} = await this.apiClient.get<E>(`${USER_URL}/${id}/`);

      return data ?? null;
    } catch (error) {
      console.error('CODE00000400 getById(): ' + error?.message);
      return null;
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
          url: USER_URL,
          method: 'get',
        });
      }
      if (typeof limit === 'boolean' && limit) {
        return this.core.getAllData({
          url: USER_URL,
          method: 'get',
          params: config,
        });
      }
      if (typeof limit === 'number' && limit > 0) {
        if (typeof all === 'boolean' && all) {
          return this.core.getAllData({
            url: USER_URL,
            method: 'get',
            params: {...config, limit},
          });
        }
        return this.core.getPagesData({
          url: USER_URL,
          method: 'get',
          params: {...config, limit},
        });
      }
      return this.core.getPagesData({
        url: USER_URL,
        method: 'get',
        params: config,
      });
    } catch (error) {
      console.error('CODE00000402 search(): ' + error?.message);
      return [];
    }
  }
}

export interface IUser extends IAlationEntity {
  'display_name': string;
  'email': string;
  'id': AlationEntityId;
  'profile_id': AlationEntityId;
  'url': string;
}

export interface IUserSearch {
  'display_name'?: string;
  'email'?: string;
  'id'?: AlationEntityId;
  'profile_id'?: AlationEntityId;
  'url'?: string;
}

const USER_URL = '/integration/v1/user';
