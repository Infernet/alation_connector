import {AbstractModel} from '../classes';
import {IEntityModel, IModel} from '../index';
import {AxiosInstance} from 'axios';
import {AlationEntityId} from '../types';
import {IAlationEntity, ICustomField} from '../interfaces';

export class DatasourceModel<Entity extends IDatasource = IDatasource, Search extends IDatasourceSearchParams = IDatasourceSearchParams>
  extends AbstractModel<Entity, any, Search, any, any>
  implements IEntityModel<Entity, any, Search, any, any> {
  constructor(jobModel: IModel, apiClient: AxiosInstance) {
    super(jobModel, apiClient, 'datasource');
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

export interface IDatasource<CustomFields extends ICustomField = ICustomField> extends IAlationEntity {
  'is_virtual': boolean;
  'uri': string;
  'dbtype': string;
  'title': string;
  'description': string;
  'url': string;
  'custom_fields': Array<CustomFields>;
}

export type IDatasourceSearchParams = {
  'id'?: AlationEntityId;
  'title'?: string;
  'dbtype'?: string;
  'is_virtual'?: boolean;
  'uri'?: string;
}
