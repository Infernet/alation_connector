import { ALATION_CATALOG_ROUTE, ALATION_NEXT_PAGE_HEADER_KEY, ALATION_UPDATE_ROUTE, alationCreateRoute, CUSTOM_FIELD_VALUE_EDIT_ROUTE, OBJECT_TYPE } from "../constants";
import { prepareApiBody, sliceCollection } from "../helpers";
export class AbstractModel {
  constructor(core, apiClient, entityType) {
    this.core = core;
    this.apiClient = apiClient;
    this.entityType = entityType;
  }

  async getById(id) {
    try {
      const {
        data
      } = await this.apiClient.get(ALATION_CATALOG_ROUTE[this.entityType], {
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
        const pages = sliceCollection(prepareApiBody(records), limit);
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
          } = await this.apiClient.post(ALATION_UPDATE_ROUTE[this.entityType], page.join('\n'));
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
        const body = prepareApiBody(records);
        const {
          data
        } = await this.apiClient.post(ALATION_UPDATE_ROUTE[this.entityType], body);
        return data;
      }
    } catch (error) {
      console.error('CODE00000301 update(): ' + (error === null || error === void 0 ? void 0 : error.message));
      throw error;
    }
  }

  async search(config, limit, all) {
    try {
      if (typeof limit === 'boolean' && limit) {
        return this.getAllData({
          url: ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get',
          params: config
        });
      }

      if (typeof limit === 'number' && limit > 0) {
        if (typeof all === 'boolean' && all) {
          return this.getAllData({
            url: ALATION_CATALOG_ROUTE[this.entityType],
            method: 'get',
            params: { ...config,
              limit
            }
          });
        }

        return this.getPagesData({
          url: ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get',
          params: { ...config,
            limit
          }
        });
      }

      return this.getPagesData({
        url: ALATION_CATALOG_ROUTE[this.entityType],
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
        } = await this.apiClient.post(alationCreateRoute(dsId), JSON.stringify({
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
          } = await this.apiClient.post(alationCreateRoute(dsId), paramsCollection.join('\n'));
          return this.core.getJobResult(job);
        }

        const pages = sliceCollection(paramsCollection, data);
        const jobCollection = [];

        for (const page of pages) {
          const {
            data: job
          } = await this.apiClient.post(alationCreateRoute(dsId), page.join('\n'));
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

  async getAllData(config) {
    try {
      const result = [];
      let response = await this.getPagesData(config);
      result.push(...response.values);

      while (response.next) {
        response = await response.next();
        result.push(...response.values);
      }

      return result;
    } catch (e) {
      console.error('CODE00000304 getAllData(): ', e === null || e === void 0 ? void 0 : e.message);
      throw e;
    }
  }

  async getPagesData(config) {
    try {
      const response = await this.apiClient(config);
      const next = response === null || response === void 0 ? void 0 : response.headers[ALATION_NEXT_PAGE_HEADER_KEY];
      return {
        values: response.data,
        next: next ? () => this.getPagesData({ ...config,
          url: next
        }) : null
      };
    } catch (e) {
      console.error('CODE00000305 getPagesData(): ', e === null || e === void 0 ? void 0 : e.message);
      throw e;
    }
  }

  async updateCustomFields(body) {
    try {
      const otype = OBJECT_TYPE[this.entityType];
      let params;

      if (!Array.isArray(body)) {
        params = JSON.stringify({ ...body,
          otype
        });
      } else {
        params = body.map(record => JSON.stringify({ ...record,
          otype
        })).join('\n');
      }

      const {
        data
      } = await this.apiClient.post(CUSTOM_FIELD_VALUE_EDIT_ROUTE, params);
      return data;
    } catch (e) {
      console.error('CODE00000306 updateCustomFields(): ' + (e === null || e === void 0 ? void 0 : e.message));
      throw e;
    }
  }

}
//# sourceMappingURL=AbstractModel.js.map