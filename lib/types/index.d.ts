import { AttributeModel, DatasourceModel, IAttribute, IAttributeUpdate, IDatasource, ISchema, ISchemaUpdate, ITable, ITableUpdate, SchemaModel, TableModel } from './models';
import { AlationConnector, IConnectorOptions } from './classes';
import { IConnectorAuthConfig, IJob, IJobFinish, IJobState } from './interfaces';
export declare class Alation<AttributeEntity extends IAttribute = IAttribute, AttributeEntityUpdate extends IAttributeUpdate = IAttributeUpdate, TableEntity extends ITable = ITable, TableEntityUpdate extends ITableUpdate = ITableUpdate, SchemaEntity extends ISchema = ISchema, SchemaEntityUpdate extends ISchemaUpdate = ISchemaUpdate, DatasourceEntity extends IDatasource = IDatasource> extends AlationConnector {
    readonly Datasource: DatasourceModel<DatasourceEntity>;
    readonly Schema: SchemaModel<SchemaEntity, SchemaEntityUpdate>;
    readonly Table: TableModel<TableEntity, TableEntityUpdate>;
    readonly Attribute: AttributeModel<AttributeEntity, AttributeEntityUpdate>;
    constructor(userData: IConnectorAuthConfig, host: string, options?: IConnectorOptions);
    getJobState(job: IJob): Promise<IJobState>;
    getJobResult(job: IJob, interval?: number): Promise<IJobFinish>;
}
export * from './classes';
export * from './helpers';
export * from './interfaces';
export * from './models';
export * from './types';
//# sourceMappingURL=index.d.ts.map