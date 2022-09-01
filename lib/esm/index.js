import { ArticleModel, AttributeModel, DatasourceModel, SchemaModel, TableModel } from "./models";
import { AlationConnector } from "./classes";
import { ALATION_JOB_STATE_ROUTE, ALATION_NEXT_PAGE_HEADER_KEY, CUSTOM_FIELD_VALUE_ROUTE } from "./constants";
import { sleep } from "./helpers";
import { JobStatusEnum } from "./types";
import { UserModel } from "./models/UserModel";
export class Alation extends AlationConnector {
  constructor(userData, host, options) {
    super(userData, host, options);
    this.Datasource = new DatasourceModel(this, this.apiClient);
    this.Schema = new SchemaModel(this, this.apiClient);
    this.Table = new TableModel(this, this.apiClient);
    this.Attribute = new AttributeModel(this, this.apiClient);
    this.Article = new ArticleModel(this, this.apiClient);
    this.User = new UserModel(this, this.apiClient);
    this.getJobState = this.getJobState.bind(this);
    this.getJobResult = this.getJobResult.bind(this);
    this.getAllData = this.getAllData.bind(this);
    this.getPagesData = this.getPagesData.bind(this);
    this.updateCustomFieldsValue = this.updateCustomFieldsValue.bind(this);
  }

  async getJobState(job) {
    try {
      const {
        data
      } = await this.apiClient.get(ALATION_JOB_STATE_ROUTE, {
        params: {
          name: job.job_name
        }
      });
      return { ...data,
        ...(data.status !== JobStatusEnum.RUNNING ? {
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
        await sleep(interval);
        response = await this.getJobState(job);
      }

      return response;
    } catch (e) {
      console.error('CODE00000101 getJobResult(): ', e === null || e === void 0 ? void 0 : e.message);
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

  async updateCustomFieldsValue(body) {
    try {
      const {
        data
      } = await this.apiClient.post(CUSTOM_FIELD_VALUE_ROUTE, body);
      return data;
    } catch (e) {
      console.error('CODE00000306 updateCustomFields(): ' + (e === null || e === void 0 ? void 0 : e.message));
      throw e;
    }
  }

  async deleteCustomFieldValue(id) {
    try {
      const {
        data
      } = await this.apiClient.delete(`${CUSTOM_FIELD_VALUE_ROUTE}${id}/`);
      return data;
    } catch (e) {
      console.error('CODE00000307 deleteCustomFieldValue(): ' + (e === null || e === void 0 ? void 0 : e.message));
      throw e;
    }
  }

}
export * from "./classes";
export * from "./helpers";
export * from "./interfaces";
export * from "./models";
export * from "./types";
//# sourceMappingURL=index.js.map