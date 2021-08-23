import { AbstractModel } from '../classes';
import { Alation } from '../index';
import { AxiosInstance } from 'axios';
import { AlationEntityId, Flag } from '../types';
import { IAlationEntity, ICustomField, IPageResponse } from '../interfaces';
export declare class DatasourceModel<Entity extends IDatasource = IDatasource> extends AbstractModel<Entity, never, never> {
    constructor(core: Alation, apiClient: AxiosInstance);
    search<S extends IDatasourceSearchParams, E extends Entity = Entity>(config: S): Promise<IPageResponse<E>>;
    search<S extends IDatasourceSearchParams, E extends Entity = Entity>(config: S, all: Flag): Promise<Array<E>>;
    search<S extends IDatasourceSearchParams, E extends Entity = Entity>(config: S, limit: number): Promise<IPageResponse<E>>;
    search<S extends IDatasourceSearchParams, E extends Entity = Entity>(config: S, limit: number, all: Flag): Promise<Array<E>>;
    protected makeEntityKey(): never;
    update(): Promise<never>;
    create(): Promise<never>;
}
export interface IDatasource<CustomFields extends ICustomField = ICustomField> extends IAlationEntity<CustomFields> {
    'is_virtual': boolean;
    'uri': string;
    'dbtype': string;
}
export declare type IDatasourceSearchParams = {
    'id'?: AlationEntityId;
    'title'?: string;
    'dbtype'?: string;
    'is_virtual'?: boolean;
    'uri'?: string;
};
//# sourceMappingURL=DatasourceModel.d.ts.map