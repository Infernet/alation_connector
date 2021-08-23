"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SchemaModel = void 0;

var _classes = require("../classes");

class SchemaModel extends _classes.AbstractModel {
  constructor(core, apiClient) {
    super(core, apiClient, 'schema'); // публичные методы

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

  async create(dsId, key, data, wait) {
    if (!Array.isArray(key)) {
      if (typeof wait === 'boolean' && wait) {
        return super.create(dsId, key, data, wait);
      }

      return super.create(dsId, key, data);
    }

    if (typeof data === 'boolean' && data) {
      return super.create(dsId, key, data);
    }

    if (typeof wait === 'boolean' && wait) {
      return super.create(dsId, key, data, wait);
    } else {
      return super.create(dsId, key, data);
    }
  }

  makeEntityKey(datasourceId, key) {
    return `${datasourceId}.${key.name}`;
  }

}

exports.SchemaModel = SchemaModel;
//# sourceMappingURL=SchemaModel.js.map