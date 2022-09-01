import { AbstractModel } from '../classes';
import { IEntityModel, IModel } from '../index';
import { AxiosInstance } from 'axios';
import { AlationEntityId } from '../types';
import { IAlationEntity, ICustomField } from '../interfaces';
export declare class DatasourceModel<Entity extends IDatasource = IDatasource, Search extends IDatasourceSearchParams = IDatasourceSearchParams> extends AbstractModel<Entity, any, Search, any, any> implements IEntityModel<Entity, any, Search, any, any> {
    constructor(jobModel: IModel, apiClient: AxiosInstance);
    protected makeEntityKey(): never;
    update(): Promise<never>;
    create(): Promise<never>;
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
export declare type IDatasourceSearchParams = {
    'id'?: AlationEntityId;
    'title'?: string;
    'dbtype'?: string;
    'is_virtual'?: boolean;
    'uri'?: string;
};
//# sourceMappingURL=DatasourceModel.d.ts.map