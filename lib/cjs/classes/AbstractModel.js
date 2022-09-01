"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractModel = void 0;

var _constants = require("../constants");

var _helpers = require("../helpers");

class AbstractModel {
  constructor(core, apiClient, entityType) {
    this.core = core;
    this.apiClient = apiClient;
    this.entityType = entityType; // публичные методы

    this.getById = this.getById.bind(this);
    this.search = this.search.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this); // вспомогательные методы

    this.makeEntityKey = this.makeEntityKey.bind(this);
  }

  async getById(id) {
    try {
      const {
        data
      } = await this.apiClient.get(_constants.ALATION_CATALOG_ROUTE[this.entityType], {
        params: {
          id
        }
      });
      return data.length ? data[0] : null;
    } catch (error) {
      console.error('CODE00000300 getById(): ' + (error === null || error === void 0 ? void 0 : error.message));
      return null;
    }
  }

  async update(records, limit = 100) {
    try {
      if (Array.isArray(records)) {
        const pages = (0, _helpers.sliceCollection)((0, _helpers.prepareApiBody)(records), limit);
        let response = {
          new_objects: 0,
          updated_objects: 0,
          number_received: 0,
          error: '',
          error_objects: []
        };

        for (const page of pages) {
          const {
            data
          } = await this.apiClient.post(_constants.ALATION_UPDATE_ROUTE[this.entityType], page.join('\n'));
          response = {
            new_objects: response.new_objects + data.new_objects,
            updated_objects: response.updated_objects + data.updated_objects,
            number_received: response.number_received + data.number_received,
            error: response.error + data.error,
            error_objects: [...response.error_objects, ...data.error_objects]
          };
        }

        return response;
      } else {
        const body = (0, _helpers.prepareApiBody)(records);
        const {
          data
        } = await this.apiClient.post(_constants.ALATION_UPDATE_ROUTE[this.entityType], body);
        return data;
      }
    } catch (error) {
      console.error('CODE00000301 update(): ' + (error === null || error === void 0 ? void 0 : error.message));
      throw error;
    }
  }

  async search(config, limit, all) {
    try {
      if (!config) {
        return this.core.getAllData({
          url: _constants.ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get'
        });
      }

      if (typeof limit === 'boolean' && limit) {
        return this.core.getAllData({
          url: _constants.ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get',
          params: config
        });
      }

      if (typeof limit === 'number' && limit > 0) {
        if (typeof all === 'boolean' && all) {
          return this.core.getAllData({
            url: _constants.ALATION_CATALOG_ROUTE[this.entityType],
            method: 'get',
            params: { ...config,
              limit
            }
          });
        }

        return this.core.getPagesData({
          url: _constants.ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get',
          params: { ...config,
            limit
          }
        });
      }

      return this.core.getPagesData({
        url: _constants.ALATION_CATALOG_ROUTE[this.entityType],
        method: 'get',
        params: config
      });
    } catch (error) {
      console.error('CODE00000302 search(): ' + (error === null || error === void 0 ? void 0 : error.message));
      return [];
    }
  }

  async create(dsId, key, data, wait) {
    try {
      if (!Array.isArray(key)) {
        const entityKey = this.makeEntityKey(dsId, key);
        const entityData = data;
        const {
          data: job
        } = await this.apiClient.post((0, _constants.alationCreateRoute)(dsId), JSON.stringify({
          key: entityKey,
          ...entityData
        }));
        return wait ? this.core.getJobResult(job) : job;
      } else {
        const paramsCollection = key.map(({
          key: k,
          data: d
        }) => JSON.stringify({
          key: this.makeEntityKey(dsId, k),
          ...d
        }));

        if (typeof data === 'boolean') {
          const {
            data: job
          } = await this.apiClient.post((0, _constants.alationCreateRoute)(dsId), paramsCollection.join('\n'));
          return this.core.getJobResult(job);
        }

        const pages = (0, _helpers.sliceCollection)(paramsCollection, data);
        const jobCollection = [];

        for (const page of pages) {
          const {
            data: job
          } = await this.apiClient.post((0, _constants.alationCreateRoute)(dsId), page.join('\n'));
          jobCollection.push(job);
        }

        if (typeof wait === 'boolean') {
          return await Promise.all(jobCollection.map(job => this.core.getJobResult(job)));
        } else {
          return jobCollection;
        }
      }
    } catch (e) {
      console.error('CODE00000303 create(): ', e === null || e === void 0 ? void 0 : e.message);
      throw e;
    }
  }

}

exports.AbstractModel = AbstractModel;
//# sourceMappingURL=AbstractModel.js.map