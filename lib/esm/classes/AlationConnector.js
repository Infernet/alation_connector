import fs from 'fs';
import { createAccessTokenRoute, createRefreshTokenRoute, HTTP_STATUS, regenerateRefreshTokenRoute, validateAccessTokenRoute, validateRefreshTokenRoute } from "../constants";
import axios from 'axios';
import { TokenStatusEnum } from "../types";
import path from 'path';
export class AlationConnector {
  constructor(user, alationURL, options) {
    this.user = user;
    const defaultOptions = {
      jobInterval: 1000,
      tokenName: 'connector_token'
    };
    this.options = { ...defaultOptions,
      ...options
    };
    this.accessTokenPath = path.resolve(process.cwd(), `keys/alation_connector_${this.options.tokenName}_access_token.json`);
    this.refreshTokenPath = path.resolve(process.cwd(), `keys/alation_connector_${this.options.tokenName}_refresh_token.json`);
    this.alationURL = alationURL.charAt(alationURL.length - 1) === '/' ? alationURL.slice(0, alationURL.length - 1) : alationURL;
    this.apiClient = axios.create({
      baseURL: this.alationURL
    }); // Привязка токена

    this.apiClient.interceptors.request.use(async config => {
      config.headers.Token = (await this.getAccessToken()).api_access_token;
      return config;
    }); // Обработка ошибки сгорания токена

    this.apiClient.interceptors.response.use(response => response, async error => {
      if (!error.response || error.response.status !== HTTP_STATUS.FORBIDDEN) {
        return error;
      }

      const {
        config
      } = error.response;
      config.headers.Token = (await this.regenerateAccessToken()).api_access_token;
      return axios(config);
    });
  }

  async getAccessToken() {
    try {
      if (fs.existsSync(this.accessTokenPath)) {
        return JSON.parse(fs.readFileSync(this.accessTokenPath, {
          encoding: 'utf-8'
        }));
      }

      return this.regenerateAccessToken();
    } catch (error) {
      console.error('CODE00000200 cant load or write alation access token key');
      console.error(error.message);
      throw error;
    }
  }

  async getRefreshToken() {
    try {
      if (fs.existsSync(this.refreshTokenPath)) {
        return JSON.parse(fs.readFileSync(this.refreshTokenPath, {
          encoding: 'utf-8'
        }));
      } else {
        return this.createOrUpdateRefreshToken();
      }
    } catch (error) {
      console.error('CODE00000201 cant load or write alation refresh token key');
      console.error(error.message);
      throw error;
    }
  }

  async regenerateAccessToken() {
    let refreshToken = await this.getRefreshToken();

    if (!(await this.validateToken(refreshToken))) {
      refreshToken = await this.createOrUpdateRefreshToken(refreshToken);
    }

    const {
      data
    } = await axios.post(createAccessTokenRoute(this.alationURL), {
      refresh_token: refreshToken.refresh_token,
      user_id: refreshToken.user_id
    });
    this.saveToken(data);
    return data;
  }

  async createOrUpdateRefreshToken(oldToken) {
    try {
      if (oldToken) {
        const {
          data
        } = await axios.post(regenerateRefreshTokenRoute(this.alationURL), {
          refresh_token: oldToken.refresh_token,
          user_id: oldToken.user_id
        });
        this.saveToken(data);
        return data;
      }

      const {
        data
      } = await axios.post(createRefreshTokenRoute(this.alationURL), { ...this.user,
        name: this.options.tokenName
      });
      this.saveToken(data);
      return data;
    } catch (error) {
      console.error(`CODE00000202 createRefreshToken() finish with error: ${error === null || error === void 0 ? void 0 : error.message}`);
      throw error;
    }
  }

  async validateToken(token) {
    try {
      if (token['refresh_token']) {
        const refreshToken = token;
        const {
          data
        } = await axios.post(validateRefreshTokenRoute(this.alationURL), {
          refresh_token: refreshToken.refresh_token,
          user_id: refreshToken.user_id
        });
        return data.token_status === TokenStatusEnum.ACTIVE;
      }

      const accessToken = token;
      const {
        data
      } = await axios.post(validateAccessTokenRoute(this.alationURL), {
        api_access_token: accessToken.api_access_token,
        user_id: accessToken.user_id
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

  saveToken(token) {
    const path = token['refresh_token'] ? this.refreshTokenPath : this.accessTokenPath;
    if (fs.existsSync(path)) fs.unlinkSync(path);
    fs.writeFileSync(path, JSON.stringify(token), {
      encoding: 'utf-8'
    });
  }

}
//# sourceMappingURL=AlationConnector.js.map