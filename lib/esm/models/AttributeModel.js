import { AbstractModel } from "../classes";
import { alationCreateRoute } from "../constants";
import { sliceCollection } from "../helpers";
export class AttributeModel extends AbstractModel {
  constructor(jobModel, apiClient) {
    super(jobModel, apiClient, 'attribute');
  }

  async create(dsId, key, data, wait) {
    if (!Array.isArray(key)) {
      const requestData = [JSON.stringify({
        key: this.makeTableEntityKey(dsId, key)
      }), JSON.stringify({
        key: this.makeEntityKey(dsId, key),
        ...data
      })].join('\n');
      const {
        data: job
      } = await this.apiClient.post(alationCreateRoute(dsId), requestData);
      return wait ? this.core.getJobResult(job) : job;
    } else {
      if (typeof data !== 'number') {
        const requestData = key.map(({
          key: k,
          data: d
        }) => {
          return [JSON.stringify({
            key: this.makeTableEntityKey(dsId, k)
          }), JSON.stringify({
            key: this.makeEntityKey(dsId, k),
            ...d
          })];
        }).flat().join('\n');
        const {
          data: job
        } = await this.apiClient.post(alationCreateRoute(dsId), requestData);

        if (typeof data === 'boolean' && data) {
          return this.core.getJobResult(job);
        }

        return job;
      }

      const requestPages = [];

      for (const page of sliceCollection(key, data)) {
        const formattedPage = [];

        for (const record of page) {
          formattedPage.push([JSON.stringify({
            key: this.makeTableEntityKey(dsId, record.key)
          }), JSON.stringify({
            key: this.makeEntityKey(dsId, record.key),
            ...record.data
          })]);
        }

        requestPages.push(formattedPage.flat().join('\n'));
      }

      const jobCollection = [];

      for (const request of requestPages) {
        const {
          data: job
        } = await this.apiClient.post(alationCreateRoute(dsId), request);
        jobCollection.push(job);
      }

      if (typeof wait === 'boolean' && wait) {
        return await Promise.all(jobCollection.map(job => this.core.getJobResult(job)));
      }

      return jobCollection;
    }
  }

  makeEntityKey(datasourceId, key) {
    return `${this.makeTableEntityKey(datasourceId, key)}.${key.name}`;
  }

  makeTableEntityKey(datasourceId, key) {
    return `${datasourceId}.${key.schema_name}.${key.table_name}`;
  }

}
//# sourceMappingURL=AttributeModel.js.map