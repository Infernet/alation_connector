import { AlationEntityId, Flag, IAlationEntity, IModel, IPageResponse } from 'src';
import { AxiosInstance } from 'axios';
export declare class UserModel<Entity extends IUser = IUser, Search extends IUserSearch = IUserSearch> {
    protected core: IModel;
    protected apiClient: AxiosInstance;
    constructor(jobModel: IModel, apiClient: AxiosInstance);
    getById<E extends Entity = Entity>(id: AlationEntityId): Promise<E | null>;
    search<E extends Entity = Entity, S extends Search = Search>(config?: S): Promise<IPageResponse<E>>;
    search<E extends Entity = Entity, S extends Search = Search>(config: S, all: Flag): Promise<Array<E>>;
    search<E extends Entity = Entity, S extends Search = Search>(config: S, limit: number): Promise<IPageResponse<E>>;
    search<E extends Entity = Entity, S extends Search = Search>(config: S, limit: number, all: Flag): Promise<Array<E>>;
}
export interface IUser extends IAlationEntity {
    'display_name': string;
    'email': string;
    'id': AlationEntityId;
    'profile_id': AlationEntityId;
    'url': string;
}
export interface IUserSearch {
    'display_name'?: string;
    'email'?: string;
    'id'?: AlationEntityId;
    'profile_id'?: AlationEntityId;
    'url'?: string;
}
//# sourceMappingURL=UserModel.d.ts.map