"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableModel = void 0;

var _classes = require("../classes");

class TableModel extends _classes.AbstractModel {
  constructor(jobModel, apiClient) {
    super(jobModel, apiClient, 'table');
  }

  makeEntityKey(datasourceId, key) {
    return `${datasourceId}.${key.schema_name}.${key.name}`;
  }

}

exports.TableModel = TableModel;
//# sourceMappingURL=TableModel.js.map