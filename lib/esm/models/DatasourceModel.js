import { AbstractModel } from "../classes";
export class DatasourceModel extends AbstractModel {
  constructor(core, apiClient) {
    super(core, apiClient, 'datasource'); // публичные методы

    this.getById = this.getById.bind(this);
    this.search = this.search.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this); // вспомогательные методы

    this.makeEntityKey = this.makeEntityKey.bind(this);
    this.getAllData = this.getAllData.bind(this);
    this.getPagesData = this.getPagesData.bind(this);
  }

  async search(config, limit, all) {
    if (typeof limit === 'boolean' && limit) {
      return super.search(config, limit);
    }

    if (typeof limit === 'number' && limit > 0) {
      if (typeof all === 'boolean' && all) {
        return super.search(config, limit, all);
      }

      return super.search(config, limit);
    }

    return super.search(config);
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