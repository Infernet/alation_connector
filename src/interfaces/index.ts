import {AxiosRequestConfig, Method} from 'axios';
import {ICreateData, ICreateKey, ICreateRecord} from './create';
import {AlationEntityId, Flag} from '../types';
import {IJob, IJobFinish} from './job';
import {IAlationEntity} from './entity';
import {IAlationUpdateBase, IUpdateResponse} from './update';
import {IEditCustomFieldValueRequest, IEditCustomFieldValueResponse} from './custom_field';

export * from './connector';
export * from './create';
export * from './entity';
export * from './job';
export * from './update';
export * from './custom_field';

export interface IRequestConfig extends AxiosRequestConfig {
  url: string;
  method: Method;
}

export interface IPageResponse<Values extends IAlationEntity> {
  values: Array<Values>;
  next: (() => Promise<IPageResponse<Values>>) | null;
}

export interface IAbstractModel<Entity extends IAlationEntity, Update extends IAlationUpdateBase, CreateKey extends ICreateKey> {
  updateCustomFields<Value = any>(body: IEditCustomFieldValueRequest<Value>): Promise<IEditCustomFieldValueResponse>;
  updateCustomFields<Value = any>(body: IEditCustomFieldValueRequest<Value>[]): Promise<IEditCustomFieldValueResponse>;

  getById<E extends Entity = Entity>(id: AlationEntityId): Promise<E | null>;

  search<S, E extends Entity = Entity>(params: S): Promise<IPageResponse<E>>;
  search<S, E extends Entity = Entity>(params: S, all: Flag): Promise<Array<E>>;
  search<S, E extends Entity = Entity>(params: S, limit: number): Promise<IPageResponse<E>>;
  search<S, E extends Entity = Entity>(params: S, limit: number, all: Flag): Promise<Array<E>>;
  create<K extends CreateKey, D extends ICreateData>(dsId: number, key: K, data: D): Promise<IJob>;

  create<K extends CreateKey, D extends ICreateData>(dsId: number, key: K, data: D, wait: Flag): Promise<IJobFinish>;
  create<K extends CreateKey, D extends ICreateData>(dsId: number, entities: ICreateRecord<K, D>[]): Promise<IJob>;
  create<K extends CreateKey, D extends ICreateData>(dsId: number, entities: ICreateRecord<K, D>[], wait: Flag): Promise<IJobFinish>;
  create<K extends CreateKey, D extends ICreateData>(dsId: number, entities: ICreateRecord<K, D>[], limit: number): Promise<IJob[]>;
  create<K extends CreateKey, D extends ICreateData>(dsId: number, entities: ICreateRecord<K, D>[], limit: number, wait: Flag): Promise<IJobFinish[]>;

  update<U extends IAlationUpdateBase = Update>(records: U, limit?: number): Promise<IUpdateResponse>;
  update<U extends IAlationUpdateBase = Update>(records: U[], limit?: number): Promise<IUpdateResponse>;
}
