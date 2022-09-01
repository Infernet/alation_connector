import { AbstractModel } from "../classes";
export class TableModel extends AbstractModel {
  constructor(jobModel, apiClient) {
    super(jobModel, apiClient, 'table');
  }

  makeEntityKey(datasourceId, key) {
    return `${datasourceId}.${key.schema_name}.${key.name}`;
  }

}
//# sourceMappingURL=TableModel.js.map