import { IAttachmentField, IAuthorField, IChildrenField, ICustomTemplate, IEditorField } from '../interfaces/fields';
import { IAlationEntity, IAlationUpdateBase, ICreateData, ICustomField, IModel, IPageResponse } from '../interfaces';
import { AlationEntityId, AlationEntityType, Flag } from '../types';
import { AxiosInstance } from 'axios';
export declare class ArticleModel<Entity extends IArticle = IArticle, Update extends IArticleUpdate = IArticleUpdate, Search extends IArticleSearch = IArticleSearch, CreateData extends IArticleCreate = IArticleCreate> {
    protected core: IModel;
    protected apiClient: AxiosInstance;
    protected entityType: AlationEntityType;
    constructor(jobModel: IModel, apiClient: AxiosInstance);
    getById<E extends Entity = Entity>(id: AlationEntityId): Promise<E | null>;
    search<E extends Entity = Entity, S extends Search = Search>(config?: S): Promise<IPageResponse<E>>;
    search<E extends Entity = Entity, S extends Search = Search>(config: S, all: Flag): Promise<Array<E>>;
    search<E extends Entity = Entity, S extends Search = Search>(config: S, limit: number): Promise<IPageResponse<E>>;
    search<E extends Entity = Entity, S extends Search = Search>(config: S, limit: number, all: Flag): Promise<Array<E>>;
    update<E extends Entity = Entity, U extends Update = Update>(records: U): Promise<E>;
    update<E extends Entity = Entity, U extends Update = Update>(records: U[]): Promise<E[]>;
    create<E extends Entity = Entity, CD extends CreateData = CreateData>(params: CD): Promise<E>;
    create<E extends Entity = Entity, CD extends CreateData = CreateData>(params: CD[]): Promise<E[]>;
    delete(id: AlationEntityId): Promise<boolean>;
    delete(idCollection: AlationEntityId[]): Promise<boolean[]>;
    addChild(id: AlationEntityId, child: IAddChild): Promise<IArticleChildren | null>;
    deleteChild(id: AlationEntityId, child: IAddChild): Promise<boolean>;
}
export interface IArticle<CustomFields extends ICustomField = ICustomField> extends IAlationEntity {
    'id': AlationEntityId;
    'agile_approval_enabled': boolean;
    'attachments': IAttachmentField[];
    'author': IAuthorField;
    'body': string;
    'children': IChildrenField[];
    'custom_fields': CustomFields[];
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
export declare type IArticleChildrenObjectType = 'table' | 'article';
export declare type IAddChild = {
    otype: IArticleChildrenObjectType;
    id: AlationEntityId;
};
//# sourceMappingURL=ArticleModel.d.ts.map