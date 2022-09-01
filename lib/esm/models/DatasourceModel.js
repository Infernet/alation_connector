import { AbstractModel } from "../classes";
export class DatasourceModel extends AbstractModel {
  constructor(jobModel, apiClient) {
    super(jobModel, apiClient, 'datasource');
  }

  makeEntityKey() {
    throw new Error('CODE00000400 method is not allowed');
  }

  async update() {
    throw new Error('CODE00000401 method is not allowed');
  }

  async create() {
    throw new Error('CODE00000402 method is not allowed');
  }

}
//# sourceMappingURL=DatasourceModel.js.map