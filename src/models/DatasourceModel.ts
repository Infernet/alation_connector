import {AbstractModel} from '../classes';
import {Alation} from '../index';
import {AxiosInstance} from 'axios';
import {AlationEntityId, Flag} from '../types';
import {IAlationEntity, ICustomField, IPageResponse} from '../interfaces';

export class DatasourceModel<Entity extends IDatasource = IDatasource> extends AbstractModel<Entity, never, never> {
  constructor(core: Alation, apiClient: AxiosInstance) {
    super(core, apiClient, 'datasource');

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

  async search<S extends IDatasourceSearchParams, E extends Entity = Entity>(config: S): Promise<IPageResponse<E>>;
  async search<S extends IDatasourceSearchParams, E extends Entity = Entity>(config: S, all: Flag): Promise<Array<E>>;
  async search<S extends IDatasourceSearchParams, E extends Entity = Entity>(config: S, limit: number): Promise<IPageResponse<E>>;
  async search<S extends IDatasourceSearchParams, E extends Entity = Entity>(config: S, limit: number, all: Flag): Promise<Array<E>>;
  async search<S extends IDatasourceSearchParams, E extends Entity = Entity>(config: S, limit?: Flag | number, all?: Flag): Promise<E[] | IPageResponse<E>> {
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


  protected makeEntityKey(): never {
    throw new Error('CODE00000400 method is not allowed');
  }

  async update(): Promise<never> {
    throw new Error('CODE00000401 method is not allowed');
  }

  async create(): Promise<never> {
    throw new Error('CODE00000402 method is not allowed');
  }
}

export interface IDatasource<CustomFields extends ICustomField = ICustomField> extends IAlationEntity<CustomFields> {
  'is_virtual': boolean;
  'uri': string;
  'dbtype': string;
}

export type IDatasourceSearchParams = {
  'id'?: AlationEntityId;
  'title'?: string;
  'dbtype'?: string;
  'is_virtual'?: boolean;
  'uri'?: string;
}
