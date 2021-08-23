"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Alation: true
};
exports.Alation = void 0;

var _models = require("./models");

Object.keys(_models).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _models[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _models[key];
    }
  });
});

var _classes = require("./classes");

Object.keys(_classes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _classes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _classes[key];
    }
  });
});

var _constants = require("./constants");

var _helpers = require("./helpers");

Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _helpers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _helpers[key];
    }
  });
});

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _interfaces = require("./interfaces");

Object.keys(_interfaces).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interfaces[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interfaces[key];
    }
  });
});

class Alation extends _classes.AlationConnector {
  constructor(userData, host, options) {
    super(userData, host, options);
    this.Datasource = new _models.DatasourceModel(this, this.apiClient);
    this.Schema = new _models.SchemaModel(this, this.apiClient);
    this.Table = new _models.TableModel(this, this.apiClient);
    this.Attribute = new _models.AttributeModel(this, this.apiClient);
  }

  async getJobState(job) {
    try {
      const {
        data
      } = await this.apiClient.get(_constants.ALATION_JOB_STATE_ROUTE, {
        params: {
          name: job.job_name
        }
      });
      return { ...data,
        ...(data.status !== _types.JobStatusEnum.RUNNING ? {
          result: JSON.parse(data.result)
        } : {})
      };
    } catch (e) {
      console.error('CODE00000100 getJobState(): ', e === null || e === void 0 ? void 0 : e.message);
      throw e;
    }
  }

  async getJobResult(job, interval = this.options.jobInterval) {
    try {
      let response = await this.getJobState(job);

      while (response.status === 'running') {
        await (0, _helpers.sleep)(interval);
        response = await this.getJobState(job);
      }

      return response;
    } catch (e) {
      console.error('CODE00000101 getJobResult(): ', e === null || e === void 0 ? void 0 : e.message);
      throw e;
    }
  }

}

exports.Alation = Alation;
//# sourceMappingURL=index.js.map