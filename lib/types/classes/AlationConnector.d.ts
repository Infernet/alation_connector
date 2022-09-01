import { AxiosInstance } from 'axios';
import { IConnector, IConnectorAuthConfig, IConnectorConfig } from '../interfaces';
export declare type IConnectorOptions = Partial<IConnectorConfig>;
export declare abstract class AlationConnector implements IConnector {
    apiClient: AxiosInstance;
    options: IConnectorConfig;
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
//# sourceMappingURL=AlationConnector.d.ts.map