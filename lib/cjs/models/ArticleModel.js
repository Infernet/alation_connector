"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArticleModel = void 0;

var _constants = require("../constants");

class ArticleModel {
  constructor(jobModel, apiClient) {
    this.core = jobModel;
    this.apiClient = apiClient;
    this.entityType = 'article';
  }

  async getById(id) {
    try {
      const {
        data
      } = await this.apiClient.get(`${_constants.ALATION_CATALOG_ROUTE[this.entityType]}/${id}/`);
      return data ?? null;
    } catch (error) {
      console.error('CODE00000300 getById(): ' + (error === null || error === void 0 ? void 0 : error.message));
      return null;
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

  async update(records) {
    try {
      if (Array.isArray(records)) {
        const result = [];

        for (const record of records) {
          const {
            id,
            ...body
          } = record;
          const {
            data
          } = await this.apiClient.put(`/integration/v1/article/${id}/`, body);
          result.push(data);
        }

        return result;
      } else {
        const {
          id,
          ...body
        } = records;
        const {
          data
        } = await this.apiClient.put(`/integration/v1/article/${id}/`, body);
        return data;
      }
    } catch (error) {
      console.error('CODE00000301 update(): ' + (error === null || error === void 0 ? void 0 : error.message));
      throw error;
    }
  }

  async create(params) {
    try {
      if (!Array.isArray(params)) {
        const {
          data: entity
        } = await this.apiClient.post(_constants.ALATION_CATALOG_ROUTE[this.entityType] + '/', params);
        return entity;
      }

      const result = [];

      for (const record of params) {
        const {
          data
        } = await this.apiClient.post(_constants.ALATION_CATALOG_ROUTE[this.entityType] + '/', record);
        result.push(data);
      }

      return result;
    } catch (e) {
      console.error('CODE00000303 create(): ', e === null || e === void 0 ? void 0 : e.message);
      throw e;
    }
  }

  async delete(idCollection) {
    try {
      if (!Array.isArray(idCollection)) {
        const response = await this.apiClient.delete(`${_constants.ALATION_CATALOG_ROUTE[this.entityType]}/${idCollection}/`);
        return response.status === _constants.HTTP_STATUS.NO_CONTENT;
      }

      const results = [];

      for (const id of idCollection) {
        const response = await this.apiClient.delete(`${_constants.ALATION_CATALOG_ROUTE[this.entityType]}/${id}/`);
        results.push(response.status === _constants.HTTP_STATUS.NO_CONTENT);
      }

      return results;
    } catch (e) {
      console.error('CODE00000304 delete(): ', e === null || e === void 0 ? void 0 : e.message);
      throw e;
    }
  }

  async addChild(id, child) {
    try {
      const {
        data
      } = await this.apiClient.post(`/api/v1/article/${id}/children/`, child);
      return data ?? null;
    } catch (e) {
      console.error('CODE00000305 addChild(): ', e === null || e === void 0 ? void 0 : e.message);
      throw e;
    }
  }

  async deleteChild(id, child) {
    try {
      const {
        status
      } = await this.apiClient.delete(`api/v1/article/${id}/children/${child.otype}=${child.id}/`);
      return status === _constants.HTTP_STATUS.NO_CONTENT;
    } catch (e) {
      console.error('CODE00000306 deleteChild(): ', e === null || e === void 0 ? void 0 : e.message);
      throw e;
    }
  }

}

exports.ArticleModel = ArticleModel;
//# sourceMappingURL=ArticleModel.js.map