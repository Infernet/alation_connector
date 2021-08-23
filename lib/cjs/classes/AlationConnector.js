"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlationConnector = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _constants = require("../constants");

var _axios = _interopRequireDefault(require("axios"));

var _types = require("../types");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AlationConnector {
  constructor(user, alationURL, options) {
    this.user = user;
    const defaultOptions = {
      jobInterval: 1000,
      tokenName: 'connector_token'
    };
    this.options = { ...defaultOptions,
      ...options
    };
    this.accessTokenPath = _path.default.resolve(process.cwd(), `keys/alation_connector_${this.options.tokenName}_access_token.json`);
    this.refreshTokenPath = _path.default.resolve(process.cwd(), `keys/alation_connector_${this.options.tokenName}_refresh_token.json`);
    this.alationURL = alationURL.charAt(alationURL.length - 1) === '/' ? alationURL.slice(0, alationURL.length - 1) : alationURL;
    this.apiClient = _axios.default.create({
      baseURL: this.alationURL
    }); // Привязка токена

    this.apiClient.interceptors.request.use(async config => {
      config.headers.Token = (await this.getAccessToken()).api_access_token;
      return config;
    }); // Обработка ошибки сгорания токена

    this.apiClient.interceptors.response.use(response => response, async error => {
      if (!error.response || error.response.status !== _constants.HTTP_STATUS.FORBIDDEN) {
        return error;
      }

      const {
        config
      } = error.response;
      config.headers.Token = (await this.regenerateAccessToken()).api_access_token;
      return (0, _axios.default)(config);
    });
  }

  async getAccessToken() {
    try {
      if (_fs.default.existsSync(this.accessTokenPath)) {
        return JSON.parse(_fs.default.readFileSync(this.accessTokenPath, {
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
      if (_fs.default.existsSync(this.refreshTokenPath)) {
        return JSON.parse(_fs.default.readFileSync(this.refreshTokenPath, {
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
    } = await _axios.default.post((0, _constants.createAccessTokenRoute)(this.alationURL), {
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
        } = await _axios.default.post((0, _constants.regenerateRefreshTokenRoute)(this.alationURL), {
          refresh_token: oldToken.refresh_token,
          user_id: oldToken.user_id
        });
        this.saveToken(data);
        return data;
      }

      const {
        data
      } = await _axios.default.post((0, _constants.createRefreshTokenRoute)(this.alationURL), { ...this.user,
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
        } = await _axios.default.post((0, _constants.validateRefreshTokenRoute)(this.alationURL), {
          refresh_token: refreshToken.refresh_token,
          user_id: refreshToken.user_id
        });
        return data.token_status === _types.TokenStatusEnum.ACTIVE;
      }

      const accessToken = token;
      const {
        data
      } = await _axios.default.post((0, _constants.validateAccessTokenRoute)(this.alationURL), {
        api_access_token: accessToken.api_access_token,
        user_id: accessToken.user_id
      });
      return data.token_status === _types.TokenStatusEnum.ACTIVE;
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
    if (_fs.default.existsSync(path)) _fs.default.unlinkSync(path);

    _fs.default.writeFileSync(path, JSON.stringify(token), {
      encoding: 'utf-8'
    });
  }

}

exports.AlationConnector = AlationConnector;
//# sourceMappingURL=AlationConnector.js.map