"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SchemaModel = void 0;

var _classes = require("../classes");

class SchemaModel extends _classes.AbstractModel {
  constructor(jobModel, apiClient) {
    super(jobModel, apiClient, 'schema');
  }

  makeEntityKey(datasourceId, key) {
    return `${datasourceId}.${key.name}`;
  }

}

exports.SchemaModel = SchemaModel;
//# sourceMappingURL=SchemaModel.js.map