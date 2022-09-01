"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserModel = void 0;

class UserModel {
  constructor(jobModel, apiClient) {
    this.core = jobModel;
    this.apiClient = apiClient;
  }

  async getById(id) {
    try {
      const {
        data
      } = await this.apiClient.get(`${USER_URL}/${id}/`);
      return data ?? null;
    } catch (error) {
      console.error('CODE00000400 getById(): ' + (error === null || error === void 0 ? void 0 : error.message));
      return null;
    }
  }

  async search(config, limit, all) {
    try {
      if (!config) {
        return this.core.getAllData({
          url: USER_URL,
          method: 'get'
        });
      }

      if (typeof limit === 'boolean' && limit) {
        return this.core.getAllData({
          url: USER_URL,
          method: 'get',
          params: config
        });
      }

      if (typeof limit === 'number' && limit > 0) {
        if (typeof all === 'boolean' && all) {
          return this.core.getAllData({
            url: USER_URL,
            method: 'get',
            params: { ...config,
              limit
            }
          });
        }

        return this.core.getPagesData({
          url: USER_URL,
          method: 'get',
          params: { ...config,
            limit
          }
        });
      }

      return this.core.getPagesData({
        url: USER_URL,
        method: 'get',
        params: config
      });
    } catch (error) {
      console.error('CODE00000402 search(): ' + (error === null || error === void 0 ? void 0 : error.message));
      return [];
    }
  }

}

exports.UserModel = UserModel;
const USER_URL = '/integration/v1/user';
//# sourceMappingURL=UserModel.js.map