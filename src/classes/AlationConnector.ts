import fs from 'fs';
import {
  createAccessTokenRoute,
  createRefreshTokenRoute,
  HTTP_STATUS,
  regenerateRefreshTokenRoute,
  validateAccessTokenRoute,
  validateRefreshTokenRoute,
} from '../constants';
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import {IAccessToken, IConnectorAuthConfig, IRefreshToken} from '../interfaces';
import {TokenStatusEnum} from '../types';
import path from 'path';

export type IConnectorOptions = Partial<IConnectorConfig>;

export abstract class AlationConnector {
  protected apiClient: AxiosInstance;
  protected options: IConnectorConfig;

  private readonly user: IConnectorAuthConfig;
  private readonly alationURL: string;
  private readonly accessTokenPath:string;
  private readonly refreshTokenPath:string;

  protected constructor(user: IConnectorAuthConfig, alationURL: string, options?: IConnectorOptions) {
    this.user = user;
    const defaultOptions: IConnectorConfig = {
      jobInterval: 1000,
      tokenName: 'connector_token',
    };
    this.options = {...defaultOptions, ...options};

    this.accessTokenPath = path.resolve(process.cwd(), `keys/alation_connector_${this.options.tokenName}_access_token.json`);
    this.refreshTokenPath = path.resolve(process.cwd(), `keys/alation_connector_${this.options.tokenName}_refresh_token.json`);

    this.alationURL = alationURL.charAt(alationURL.length - 1) === '/' ? alationURL.slice(0, alationURL.length - 1) : alationURL;
    this.apiClient = axios.create({baseURL: this.alationURL});
    // Привязка токена
    this.apiClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
      config.headers.Token = (await this.getAccessToken()).api_access_token;
      return config;
    });
    // Обработка ошибки сгорания токена
    this.apiClient.interceptors.response.use((response) => response, async (error: AxiosError) => {
      if (!error.response || error.response.status !== HTTP_STATUS.FORBIDDEN) {
        return error;
      }
      const {config} = error.response;
      config.headers.Token = (await this.regenerateAccessToken()).api_access_token;
      return axios(config);
    });
  }

  private async getAccessToken(): Promise<IAccessToken> {
    try {
      if (fs.existsSync(this.accessTokenPath)) {
        return JSON.parse(fs.readFileSync(this.accessTokenPath, {encoding: 'utf-8'}));
      }
      return this.regenerateAccessToken();
    } catch (error) {
      console.error('CODE00000200 cant load or write alation access token key');
      console.error(error.message);
      throw error;
    }
  }

  private async getRefreshToken(): Promise<IRefreshToken> {
    try {
      if (fs.existsSync(this.refreshTokenPath)) {
        return JSON.parse(fs.readFileSync(this.refreshTokenPath, {encoding: 'utf-8'}));
      } else {
        return this.createOrUpdateRefreshToken();
      }
    } catch (error) {
      console.error('CODE00000201 cant load or write alation refresh token key');
      console.error(error.message);
      throw error;
    }
  }

  private async regenerateAccessToken(): Promise<IAccessToken> {
    let refreshToken = await this.getRefreshToken();
    if (!(await this.validateToken(refreshToken))) {
      refreshToken = await this.createOrUpdateRefreshToken(refreshToken);
    }
    const {data} = await axios.post<IAccessToken>(createAccessTokenRoute(this.alationURL), {
      refresh_token: refreshToken.refresh_token,
      user_id: refreshToken.user_id,
    });
    this.saveToken(data);
    return data;
  }

  private async createOrUpdateRefreshToken(oldToken?: IRefreshToken): Promise<IRefreshToken> {
    try {
      if (oldToken) {
        const {data} = await axios.post<IRefreshToken>(regenerateRefreshTokenRoute(this.alationURL), {
          refresh_token: oldToken.refresh_token,
          user_id: oldToken.user_id,
        });
        this.saveToken(data);
        return data;
      }
      const {data} = await axios.post<IRefreshToken>(createRefreshTokenRoute(this.alationURL), {
        ...this.user,
        name: this.options.tokenName,
      });
      this.saveToken(data);
      return data;
    } catch (error) {
      console.error(`CODE00000202 createRefreshToken() finish with error: ${error?.message}`);
      throw error;
    }
  }

  private async validateToken(token: IAccessToken | IRefreshToken): Promise<boolean> {
    try {
      if ((token as IRefreshToken)['refresh_token']) {
        const refreshToken = token as IRefreshToken;
        const {data} = await axios.post<IRefreshToken>(validateRefreshTokenRoute(this.alationURL),
            {
              refresh_token: refreshToken.refresh_token,
              user_id: refreshToken.user_id,
            });
        return data.token_status === TokenStatusEnum.ACTIVE;
      }
      const accessToken = token as IAccessToken;
      const {data} = await axios.post<IAccessToken>(validateAccessTokenRoute(this.alationURL),
          {
            api_access_token: accessToken.api_access_token,
            user_id: accessToken.user_id,
          });
      return data.token_status === TokenStatusEnum.ACTIVE;
    } catch (error) {
      if (error.response) {
        return false;
      }
      console.error('CODE00000203 cant valid token, maybe token was expired or deleted');
      console.error(error.message);
      throw error;
    }
  }

  private saveToken(token: IAccessToken | IRefreshToken): void {
    const path = ((token as IRefreshToken)['refresh_token']) ? this.refreshTokenPath : this.accessTokenPath;
    if (fs.existsSync(path)) fs.unlinkSync(path);
    fs.writeFileSync(path, JSON.stringify(token), {encoding: 'utf-8'});
  }
}

interface IConnectorConfig {
  jobInterval: number;
  tokenName: string;
}
