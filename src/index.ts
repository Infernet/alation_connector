import {
  AttributeModel,
  DatasourceModel,
  IAttribute,
  IAttributeUpdate,
  IDatasource,
  ISchema,
  ISchemaUpdate,
  ITable,
  ITableUpdate,
  SchemaModel,
  TableModel,
} from './models';
import {AlationConnector, IConnectorOptions} from './classes';
import {IConnectorAuthConfig, IJob, IJobFinish, IJobSerialize, IJobState} from './interfaces';
import {ALATION_JOB_STATE_ROUTE} from './constants';
import {sleep} from './helpers';
import {JobStatusEnum} from './types';

export class Alation<AttributeEntity extends IAttribute = IAttribute, AttributeEntityUpdate extends IAttributeUpdate = IAttributeUpdate,
    TableEntity extends ITable = ITable, TableEntityUpdate extends ITableUpdate = ITableUpdate,
    SchemaEntity extends ISchema = ISchema, SchemaEntityUpdate extends ISchemaUpdate = ISchemaUpdate,
    DatasourceEntity extends IDatasource = IDatasource> extends AlationConnector {
  public readonly Datasource: DatasourceModel<DatasourceEntity>;
  public readonly Schema: SchemaModel<SchemaEntity, SchemaEntityUpdate>;
  public readonly Table: TableModel<TableEntity, TableEntityUpdate>;
  public readonly Attribute: AttributeModel<AttributeEntity, AttributeEntityUpdate>;


  constructor(userData: IConnectorAuthConfig, host: string, options?:IConnectorOptions) {
    super(userData, host, options);
    this.Datasource = new DatasourceModel<DatasourceEntity>(this, this.apiClient);
    this.Schema = new SchemaModel<SchemaEntity, SchemaEntityUpdate>(this, this.apiClient);
    this.Table = new TableModel<TableEntity, TableEntityUpdate>(this, this.apiClient);
    this.Attribute = new AttributeModel<AttributeEntity, AttributeEntityUpdate>(this, this.apiClient);
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
}

export * from './classes';
export * from './helpers';
export * from './interfaces';
export * from './models';
export * from './types';
