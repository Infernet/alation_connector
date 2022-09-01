"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatasourceModel = void 0;

var _classes = require("../classes");

class DatasourceModel extends _classes.AbstractModel {
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

exports.DatasourceModel = DatasourceModel;
//# sourceMappingURL=DatasourceModel.js.map