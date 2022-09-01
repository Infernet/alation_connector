import {AxiosInstance, AxiosRequestConfig, Method} from 'axios';
import {ICreateData, ICreateKey, ICreateRecord} from './create';
import {AlationEntityId, Flag} from '../types';
import {IJob, IJobFinish, IJobState} from './job';
import {IAlationEntity} from './entity';
import {IAlationUpdateBase, IUpdateResponse} from './update';
import {ICustomFieldValue, ICustomFieldValueDeleteResponse, ICustomFieldValueResponse} from './custom_field';

export * from './connector';
export * from './create';
export * from './entity';
export * from './job';
export * from './update';
export * from './custom_field';

export interface IConnectorConfig {
  jobInterval: number;
  tokenName: string;
  tokenStoragePath: string;
}

export interface IRequestConfig extends AxiosRequestConfig {
  url: string;
  method: Method;
}

export interface IPageResponse<Values extends IAlationEntity> {
  values: Array<Values>;
  next: (() => Promise<IPageResponse<Values>>) | null;
}

export interface IConnector {
  apiClient: AxiosInstance;
  options: IConnectorConfig;
}

export interface IModel {
  getJobState(job: IJob): Promise<IJobState>;

  getJobResult(job: IJob, interval?: number): Promise<IJobFinish>;

  updateCustomFieldsValue<V = any>(body: ICustomFieldValue<V>): Promise<ICustomFieldValueResponse<V>>;

  deleteCustomFieldValue(id: AlationEntityId): Promise<ICustomFieldValueDeleteResponse>;

  getPagesData<E extends IAlationEntity>(config: IRequestConfig): Promise<IPageResponse<E>>;

  getAllData<E extends IAlationEntity>(config: IRequestConfig): Promise<Array<E>>;
}

export interface IEntityModel<E extends IAlationEntity, U extends IAlationUpdateBase, S, CKey extends ICreateKey, CData extends ICreateData> {
  getById(id: AlationEntityId): Promise<E | null>;

  search(params?: S): Promise<IPageResponse<E>>;

  search(params: S, all: Flag): Promise<Array<E>>;

  search(params: S, limit: number): Promise<IPageResponse<E>>;

  search(params: S, limit: number, all: Flag): Promise<Array<E>>;

  create(dsId: number, key: CKey, data: CData): Promise<IJob>;

  create(dsId: number, key: CKey, data: CData, wait: Flag): Promise<IJobFinish>;

  create(dsId: number, entities: ICreateRecord<CKey, CData>[]): Promise<IJob>;

  create(dsId: number, entities: ICreateRecord<CKey, CData>[], wait: Flag): Promise<IJobFinish>;

  create(dsId: number, entities: ICreateRecord<CKey, CData>[], limit: number): Promise<IJob[]>;

  create(dsId: number, entities: ICreateRecord<CKey, CData>[], limit: number, wait: Flag): Promise<IJobFinish[]>;

  update(records: U, limit?: number): Promise<IUpdateResponse>;

  update(records: U[], limit?: number): Promise<IUpdateResponse>;
}
