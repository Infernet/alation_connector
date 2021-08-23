import { AxiosInstance } from 'axios';
import { IConnectorAuthConfig } from '../interfaces';
export declare type IConnectorOptions = Partial<IConnectorConfig>;
export declare abstract class AlationConnector {
    protected apiClient: AxiosInstance;
    protected options: IConnectorConfig;
    private readonly user;
    private readonly alationURL;
    private readonly accessTokenPath;
    private readonly refreshTokenPath;
    protected constructor(user: IConnectorAuthConfig, alationURL: string, options?: IConnectorOptions);
    private getAccessToken;
    private getRefreshToken;
    private regenerateAccessToken;
    private createOrUpdateRefreshToken;
    private validateToken;
    private saveToken;
}
interface IConnectorConfig {
    jobInterval: number;
    tokenName: string;
    tokenStoragePath: string;
}
export {};
//# sourceMappingURL=AlationConnector.d.ts.map