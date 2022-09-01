import { ArticleModel, AttributeModel, DatasourceModel, SchemaModel, TableModel } from './models';
import { AlationConnector, IConnectorOptions } from './classes';
import { IAlationEntity, IConnectorAuthConfig, ICustomFieldValue, ICustomFieldValueDeleteResponse, ICustomFieldValueResponse, IJob, IJobFinish, IJobState, IModel, IPageResponse, IRequestConfig } from './interfaces';
import { AlationEntityId } from './types';
import { UserModel } from './models/UserModel';
export declare class Alation<Article extends ArticleModel = ArticleModel, Attribute extends AttributeModel = AttributeModel, Table extends TableModel = TableModel, Schema extends SchemaModel = SchemaModel, Datasource extends DatasourceModel = DatasourceModel, User extends UserModel = UserModel> extends AlationConnector implements IModel {
    readonly Datasource: Datasource;
    readonly Schema: Schema;
    readonly Table: Table;
    readonly Attribute: Attribute;
    readonly Article: Article;
    readonly User: User;
    constructor(userData: IConnectorAuthConfig, host: string, options?: IConnectorOptions);
    getJobState(job: IJob): Promise<IJobState>;
    getJobResult(job: IJob, interval?: number): Promise<IJobFinish>;
    getAllData<E extends IAlationEntity>(config: IRequestConfig): Promise<Array<E>>;
    getPagesData<E extends IAlationEntity>(config: IRequestConfig): Promise<IPageResponse<E>>;
    updateCustomFieldsValue<V = any>(body: ICustomFieldValue<V>): Promise<ICustomFieldValueResponse<V>>;
    deleteCustomFieldValue(id: AlationEntityId): Promise<ICustomFieldValueDeleteResponse>;
}
export * from './classes';
export * from './helpers';
export * from './interfaces';
export * from './models';
export * from './types';
//# sourceMappingURL=index.d.ts.map