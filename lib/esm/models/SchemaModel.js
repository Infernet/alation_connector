import { AbstractModel } from "../classes";
export class SchemaModel extends AbstractModel {
  constructor(jobModel, apiClient) {
    super(jobModel, apiClient, 'schema');
  }

  makeEntityKey(datasourceId, key) {
    return `${datasourceId}.${key.name}`;
  }

}
//# sourceMappingURL=SchemaModel.js.map