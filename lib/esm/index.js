import { AttributeModel, DatasourceModel, SchemaModel, TableModel } from "./models";
import { AlationConnector } from "./classes";
import { ALATION_JOB_STATE_ROUTE } from "./constants";
import { sleep } from "./helpers";
import { JobStatusEnum } from "./types";
export class Alation extends AlationConnector {
  constructor(userData, host, options) {
    super(userData, host, options);
    this.Datasource = new DatasourceModel(this, this.apiClient);
    this.Schema = new SchemaModel(this, this.apiClient);
    this.Table = new TableModel(this, this.apiClient);
    this.Attribute = new AttributeModel(this, this.apiClient);
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

}
export * from "./classes";
export * from "./helpers";
export * from "./interfaces";
export * from "./models";
export * from "./types";
//# sourceMappingURL=index.js.map