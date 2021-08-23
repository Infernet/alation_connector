import { AxiosInstance } from 'axios';
import { Alation, AlationEntityType } from '..';
import { IAbstractModel, IAlationEntity, IAlationUpdateBase, ICreateData, ICreateKey, ICreateRecord, IEditCustomFieldValueRequest, IEditCustomFieldValueResponse, IJob, IJobFinish, IPageResponse, IRequestConfig, IUpdateResponse } from '../interfaces';
import { AlationEntityId, AlationKey, Flag } from '../types';
export declare abstract class AbstractModel<Entity extends IAlationEntity, Update extends IAlationUpdateBase, CreateKey extends ICreateKey> implements IAbstractModel<Entity, Update, CreateKey> {
    protected core: Alation;
    protected apiClient: AxiosInstance;
    protected entityType: AlationEntityType;
    protected constructor(core: Alation, apiClient: AxiosInstance, entityType: AlationEntityType);
    getById<E extends Entity = Entity>(id: AlationEntityId): Promise<E | null>;
    update<U extends IAlationUpdateBase = Update>(records: U, limit?: number): Promise<IUpdateResponse>;
    update<U extends IAlationUpdateBase = Update>(records: U[], limit?: number): Promise<IUpdateResponse>;
    search<S, E extends Entity>(config: S): Promise<IPageResponse<E>>;
    search<S, E extends Entity>(config: S, all: Flag): Promise<Array<E>>;
    search<S, E extends Entity>(config: S, limit: number): Promise<IPageResponse<E>>;
    search<S, E extends Entity>(config: S, limit: number, all: Flag): Promise<Array<E>>;
    create<K extends CreateKey, D extends ICreateData>(dsId: number, key: K, data: D): Promise<IJob>;
    create<K extends CreateKey, D extends ICreateData>(dsId: number, key: K, data: D, wait: Flag): Promise<IJobFinish>;
    create<K extends CreateKey, D extends ICreateData>(dsId: number, entities: ICreateRecord<K, D>[]): Promise<IJob>;
    create<K extends CreateKey, D extends ICreateData>(dsId: number, entities: ICreateRecord<K, D>[], wait: Flag): Promise<IJobFinish>;
    create<K extends CreateKey, D extends ICreateData>(dsId: number, entities: ICreateRecord<K, D>[], limit: number): Promise<IJob[]>;
    create<K extends CreateKey, D extends ICreateData>(dsId: number, entities: ICreateRecord<K, D>[], limit: number, wait: Flag): Promise<IJobFinish[]>;
    protected abstract makeEntityKey(datasourceId: number, key: CreateKey): AlationKey;
    protected getAllData<E extends Entity = Entity>(config: IRequestConfig): Promise<Array<E>>;
    protected getPagesData<E extends Entity = Entity>(config: IRequestConfig): Promise<IPageResponse<E>>;
    updateCustomFields<V = any>(body: IEditCustomFieldValueRequest<V>): Promise<IEditCustomFieldValueResponse>;
    updateCustomFields<V = any>(body: IEditCustomFieldValueRequest<V>[]): Promise<IEditCustomFieldValueResponse>;
}
//# sourceMappingURL=AbstractModel.d.ts.map