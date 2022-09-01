import {IAttachmentField, IAuthorField, IChildrenField, ICustomTemplate, IEditorField} from '../interfaces/fields';
import {IAlationEntity, IAlationUpdateBase, ICreateData, ICustomField, IModel, IPageResponse} from '../interfaces';
import {AlationEntityId, AlationEntityType, Flag} from '../types';
import {AxiosInstance} from 'axios';
import {ALATION_CATALOG_ROUTE, HTTP_STATUS} from '../constants';

export class ArticleModel<Entity extends IArticle = IArticle,
    Update extends IArticleUpdate = IArticleUpdate,
    Search extends IArticleSearch = IArticleSearch,
    CreateData extends IArticleCreate = IArticleCreate> {
  protected core: IModel;
  protected apiClient: AxiosInstance;
  protected entityType: AlationEntityType;

  constructor(jobModel: IModel, apiClient: AxiosInstance) {
    this.core = jobModel;
    this.apiClient = apiClient;
    this.entityType = 'article';
  }

  async getById<E extends Entity = Entity>(id: AlationEntityId): Promise<E | null> {
    try {
      const {data} = await this.apiClient.get<E>(`${ALATION_CATALOG_ROUTE[this.entityType]}/${id}/`);

      return data ?? null;
    } catch (error) {
      console.error('CODE00000300 getById(): ' + error?.message);
      return null;
    }
  }

  async search<E extends Entity = Entity, S extends Search = Search>(config?: S): Promise<IPageResponse<E>>;
  async search<E extends Entity = Entity, S extends Search = Search>(config: S, all: Flag): Promise<Array<E>>;
  async search<E extends Entity = Entity, S extends Search = Search>(config: S, limit: number): Promise<IPageResponse<E>>;
  async search<E extends Entity = Entity, S extends Search = Search>(config: S, limit: number, all: Flag): Promise<Array<E>>;
  async search<E extends Entity = Entity, S extends Search = Search>(config?: S, limit?: Flag | number, all?: Flag): Promise<E[] | IPageResponse<E>> {
    try {
      if (!config) {
        return this.core.getAllData({
          url: ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get',
        });
      }
      if (typeof limit === 'boolean' && limit) {
        return this.core.getAllData<E>({
          url: ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get',
          params: config,
        });
      }
      if (typeof limit === 'number' && limit > 0) {
        if (typeof all === 'boolean' && all) {
          return this.core.getAllData<E>({
            url: ALATION_CATALOG_ROUTE[this.entityType],
            method: 'get',
            params: {...config, limit},
          });
        }
        return this.core.getPagesData<E>({
          url: ALATION_CATALOG_ROUTE[this.entityType],
          method: 'get',
          params: {...config, limit},
        });
      }
      return this.core.getPagesData<E>({
        url: ALATION_CATALOG_ROUTE[this.entityType],
        method: 'get',
        params: config,
      });
    } catch (error) {
      console.error('CODE00000302 search(): ' + error?.message);
      return [];
    }
  }

  async update<E extends Entity = Entity, U extends Update = Update>(records: U): Promise<E>;
  async update<E extends Entity = Entity, U extends Update = Update>(records: U[]): Promise<E[]>;
  async update<E extends Entity = Entity, U extends Update = Update>(records: U[] | U): Promise<E | E[]> {
    try {
      if (Array.isArray(records)) {
        const result: E[] = [];

        for (const record of records) {
          const {id, ...body} = record;

          const {data} = await this.apiClient.put<E>(`/integration/v1/article/${id}/`, body);
          result.push(data);
        }
        return result;
      } else {
        const {id, ...body} = records;
        const {data} = await this.apiClient.put<E>(`/integration/v1/article/${id}/`, body);
        return data;
      }
    } catch (error) {
      console.error('CODE00000301 update(): ' + error?.message);
      throw error;
    }
  }

  async create<E extends Entity = Entity, CD extends CreateData = CreateData>(params: CD): Promise<E>
  async create<E extends Entity = Entity, CD extends CreateData = CreateData>(params: CD[]): Promise<E[]>
  async create<E extends Entity = Entity, CD extends CreateData = CreateData>(params: CD | CD[]): Promise<E | E[]> {
    try {
      if (!Array.isArray(params)) {
        const {data: entity} = await this.apiClient.post<E>(ALATION_CATALOG_ROUTE[this.entityType] + '/', params);

        return entity;
      }

      const result: E[] = [];
      for (const record of params) {
        const {data} = await this.apiClient.post<E>(ALATION_CATALOG_ROUTE[this.entityType] + '/', record);
        result.push(data);
      }

      return result;
    } catch (e) {
      console.error('CODE00000303 create(): ', e?.message);
      throw e;
    }
  }

  async delete(id: AlationEntityId): Promise<boolean>;
  async delete(idCollection: AlationEntityId[]): Promise<boolean[]>;
  async delete(idCollection: AlationEntityId | AlationEntityId[]): Promise<boolean | boolean[]> {
    try {
      if (!Array.isArray(idCollection)) {
        const response = await this.apiClient.delete(`${ALATION_CATALOG_ROUTE[this.entityType]}/${idCollection}/`);
        return response.status === HTTP_STATUS.NO_CONTENT;
      }
      const results: boolean[] = [];
      for (const id of idCollection) {
        const response = await this.apiClient.delete(`${ALATION_CATALOG_ROUTE[this.entityType]}/${id}/`);
        results.push(response.status === HTTP_STATUS.NO_CONTENT);
      }
      return results;
    } catch (e) {
      console.error('CODE00000304 delete(): ', e?.message);
      throw e;
    }
  }


  async addChild(id: AlationEntityId, child: IAddChild): Promise<IArticleChildren | null> {
    try {
      const {data} = await this.apiClient.post<IArticleChildren>(`/api/v1/article/${id}/children/`, child);
      return data ?? null;
    } catch (e) {
      console.error('CODE00000305 addChild(): ', e?.message);
      throw e;
    }
  }

  async deleteChild(id: AlationEntityId, child: IAddChild): Promise<boolean> {
    try {
      const {status} = await this.apiClient.delete<IArticleChildren>(`api/v1/article/${id}/children/${child.otype}=${child.id}/`);
      return status === HTTP_STATUS.NO_CONTENT;
    } catch (e) {
      console.error('CODE00000306 deleteChild(): ', e?.message);
      throw e;
    }
  }
}

export interface IArticle<CustomFields extends ICustomField = ICustomField> extends IAlationEntity {
  'id': AlationEntityId;
  'agile_approval_enabled': boolean;
  'attachments': IAttachmentField[];
  'author': IAuthorField;
  'body': string;
  'children': IChildrenField[];
  'custom_fields': CustomFields[],
  'custom_templates': ICustomTemplate[];
  'editors': IEditorField[];
  'has_children': boolean;
  'private': boolean;
  'title': string;
  'ts_updated': string;
  'ts_created': string;
  'url': string;
}

export interface IArticleUpdate extends IAlationUpdateBase {
  'id': AlationEntityId;
  'title': string;
  'body': string;
  'private'?: boolean;
  'agile_approval_enabled'?: boolean;
  'custom_templates'?: AlationEntityId[];
  'children'?: IArticleChildren[];
}

export interface IArticleSearch {
  /**
   * Filter articles with this title.
   * Example: Articles API
   */
  'title'?: string;
  /**
   * Filter articles whose titles contain this word.
   * Example: title__icontains=sales
   */
  'title__icontains'?: string;
  /**
   * Filter articles with/without children. Example: has_children=true
   */
  'has_children'?: boolean;
  /**
   * Filter articles with atleast one custom_template belonging to this list.
   * Example: custom_field_templates=[1,2]
   */
  'custom_field_templates'?: AlationEntityId[];
  /**
   * Fields that needs to be returned for each article.
   * Example: values=id,custom_templates
   */
  'values'?: string;
}

export interface IArticleCreate extends ICreateData {
  /**
   * The title of the article.
   */
  'title': string;
  /**
   * The body of the article.
   */
  'body': string;
  /**
   * If the article is private.
   */
  'private'?: boolean;
  /**
   * true when Agile Approval is enabled on the article. For new Articles, this defaults to false.
   */
  'agile_approval_enabled'?: boolean;
  /**
   * List of updated custom-template Ids.
   Example: [1,2,3]
   */
  'custom_templates'?: AlationEntityId[];
  /**
   * List of new children (can be article or table), to be added to the article.
   Example: [{"id": 1, "otype": "Table"}, {"id": 3, "otype": "Article"}]
   */
  'children'?: Omit<Omit<IChildrenField, 'title'>, 'url'>[];
}

export interface IArticleChildren {
  id: AlationEntityId;
  otype: IArticleChildrenObjectType;
}

export type IArticleChildrenObjectType = 'table' | 'article';

export type IAddChild = {
  otype: IArticleChildrenObjectType;
  id: AlationEntityId;
}
