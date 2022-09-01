import {ArticleModel, AttributeModel, DatasourceModel, SchemaModel, TableModel} from './models';
import {AlationConnector, IConnectorOptions} from './classes';
import {
  IAlationEntity,
  IConnectorAuthConfig,
  ICustomFieldValue,
  ICustomFieldValueDeleteResponse,
  ICustomFieldValueResponse,
  IJob,
  IJobFinish,
  IJobSerialize,
  IJobState,
  IModel,
  IPageResponse,
  IRequestConfig,
} from './interfaces';
import {ALATION_JOB_STATE_ROUTE, ALATION_NEXT_PAGE_HEADER_KEY, CUSTOM_FIELD_VALUE_ROUTE} from './constants';
import {sleep} from './helpers';
import {AlationEntityId, JobStatusEnum} from './types';
import {AxiosPromise} from 'axios';
import {UserModel} from './models/UserModel';

export class Alation<Article extends ArticleModel = ArticleModel,
    Attribute extends AttributeModel = AttributeModel,
    Table extends TableModel = TableModel,
    Schema extends SchemaModel = SchemaModel,
    Datasource extends DatasourceModel = DatasourceModel,
    User extends UserModel = UserModel> extends AlationConnector implements IModel {
  public readonly Datasource: Datasource;
  public readonly Schema: Schema;
  public readonly Table: Table;
  public readonly Attribute: Attribute;
  public readonly Article: Article;
  public readonly User: User;


  constructor(userData: IConnectorAuthConfig, host: string, options?: IConnectorOptions) {
    super(userData, host, options);
    this.Datasource = new DatasourceModel(this, this.apiClient) as Datasource;
    this.Schema = new SchemaModel(this, this.apiClient) as Schema;
    this.Table = new TableModel(this, this.apiClient) as Table;
    this.Attribute = new AttributeModel(this, this.apiClient) as Attribute;
    this.Article = new ArticleModel(this, this.apiClient) as Article;
    this.User = new UserModel(this, this.apiClient) as User;

    this.getJobState = this.getJobState.bind(this);
    this.getJobResult = this.getJobResult.bind(this);
    this.getAllData = this.getAllData.bind(this);
    this.getPagesData = this.getPagesData.bind(this);
    this.updateCustomFieldsValue = this.updateCustomFieldsValue.bind(this);
  }

  async getJobState(job: IJob): Promise<IJobState> {
    try {
      const {data} = await this.apiClient.get<IJobSerialize>(ALATION_JOB_STATE_ROUTE, {params: {name: job.job_name}});
      return {...data, ...(data.status !== JobStatusEnum.RUNNING ? {result: JSON.parse(data.result)} : {})};
    } catch (e) {
      console.error('CODE00000100 getJobState(): ', e?.message);
      throw e;
    }
  }

  async getJobResult(job: IJob, interval = this.options.jobInterval): Promise<IJobFinish> {
    try {
      let response = await this.getJobState(job);
      while (response.status === 'running') {
        await sleep(interval);
        response = await this.getJobState(job);
      }
      return response as IJobFinish;
    } catch (e) {
      console.error('CODE00000101 getJobResult(): ', e?.message);
      throw e;
    }
  }

  async getAllData<E extends IAlationEntity>(config: IRequestConfig): Promise<Array<E>> {
    try {
      const result: Array<E> = [];

      let response = await this.getPagesData<E>(config);
      result.push(...response.values);

      while (response.next) {
        response = await response.next();
        result.push(...response.values);
      }

      return result;
    } catch (e) {
      console.error('CODE00000304 getAllData(): ', e?.message);
      throw e;
    }
  }

  async getPagesData<E extends IAlationEntity>(config: IRequestConfig): Promise<IPageResponse<E>> {
    try {
      const response = await (this.apiClient(config) as AxiosPromise<E[]>);
      const next: string | undefined = response?.headers[ALATION_NEXT_PAGE_HEADER_KEY];

      return {
        values: response.data,
        next: next ? () => (this.getPagesData({...config, url: next})) : null,
      };
    } catch (e) {
      console.error('CODE00000305 getPagesData(): ', e?.message);
      throw e;
    }
  }

  async updateCustomFieldsValue<V = any>(body: ICustomFieldValue<V>): Promise<ICustomFieldValueResponse<V>> {
    try {
      const {data} = await this.apiClient.post<ICustomFieldValueResponse>(CUSTOM_FIELD_VALUE_ROUTE, body);
      return data;
    } catch (e) {
      console.error('CODE00000306 updateCustomFields(): ' + e?.message);
      throw e;
    }
  }

  async deleteCustomFieldValue(id: AlationEntityId): Promise<ICustomFieldValueDeleteResponse> {
    try {
      const {data} = await this.apiClient.delete<ICustomFieldValueDeleteResponse>(`${CUSTOM_FIELD_VALUE_ROUTE}${id}/`);
      return data;
    } catch (e) {
      console.error('CODE00000307 deleteCustomFieldValue(): ' + e?.message);
      throw e;
    }
  }
}

export * from './classes';
export * from './helpers';
export * from './interfaces';
export * from './models';
export * from './types';
