import {TokenStatusEnum} from '../types';

export interface IConnectorAuthConfig {
  username: string;
  password: string;
}

export interface IBaseToken {
  'user_id': number;
  'token_status': TokenStatusEnum;
  'token_expires_at': string;
  'created_at': string;
}

export interface IAccessToken extends IBaseToken {
  'api_access_token': string;
}

export interface IRefreshToken extends IBaseToken {
  'last_used_at': null | string;
  'name': string;
  'refresh_token': string;
}
