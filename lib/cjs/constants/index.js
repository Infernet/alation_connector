"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alationCreateRoute = alationCreateRoute;
exports.regenerateRefreshTokenRoute = regenerateRefreshTokenRoute;
exports.createRefreshTokenRoute = createRefreshTokenRoute;
exports.createAccessTokenRoute = createAccessTokenRoute;
exports.validateAccessTokenRoute = validateAccessTokenRoute;
exports.validateRefreshTokenRoute = validateRefreshTokenRoute;
exports.OBJECT_TYPE = exports.HTTP_STATUS = exports.CUSTOM_FIELD_VALUE_EDIT_ROUTE = exports.ALATION_JOB_STATE_ROUTE = exports.ALATION_UPDATE_ROUTE = exports.ALATION_CATALOG_ROUTE = exports.ALATION_NEXT_PAGE_HEADER_KEY = void 0;
const ALATION_NEXT_PAGE_HEADER_KEY = 'x-next-page'; // eslint-disable-next-line no-unused-vars

exports.ALATION_NEXT_PAGE_HEADER_KEY = ALATION_NEXT_PAGE_HEADER_KEY;
const ALATION_CATALOG_ROUTE = {
  datasource: '/catalog/datasource',
  schema: '/catalog/schema',
  table: '/catalog/table',
  attribute: '/catalog/column'
}; // eslint-disable-next-line no-unused-vars

exports.ALATION_CATALOG_ROUTE = ALATION_CATALOG_ROUTE;
const ALATION_UPDATE_ROUTE = {
  datasource: '/api/v1/bulk_metadata/custom_fields/default/datasource?replace_values=true',
  schema: '/api/v1/bulk_metadata/custom_fields/default/schema?replace_values=true',
  table: '/api/v1/bulk_metadata/custom_fields/default/table?replace_values=true',
  attribute: '/api/v1/bulk_metadata/custom_fields/default/attribute?replace_values=true'
};
exports.ALATION_UPDATE_ROUTE = ALATION_UPDATE_ROUTE;
const ALATION_JOB_STATE_ROUTE = '/api/v1/bulk_metadata/job/';
exports.ALATION_JOB_STATE_ROUTE = ALATION_JOB_STATE_ROUTE;
const CUSTOM_FIELD_VALUE_EDIT_ROUTE = `/integration/v2/custom_field_value/`;
exports.CUSTOM_FIELD_VALUE_EDIT_ROUTE = CUSTOM_FIELD_VALUE_EDIT_ROUTE;

function alationCreateRoute(datasourceId) {
  return `api/v1/bulk_metadata/extraction/${datasourceId}?set_title_descs=true`;
}

function regenerateRefreshTokenRoute(baseUrl) {
  return `${baseUrl}/integration/v1/regenRefreshToken/`;
}

function createRefreshTokenRoute(baseUrl) {
  return `${baseUrl}/integration/v1/createRefreshToken/`;
}

function createAccessTokenRoute(baseUrl) {
  return `${baseUrl}/integration/v1/createAPIAccessToken/`;
}

function validateAccessTokenRoute(baseUrl) {
  return `${baseUrl}/integration/v1/validateAPIAccessToken/`;
}

function validateRefreshTokenRoute(baseUrl) {
  return `${baseUrl}/integration/v1/validateRefreshToken/`;
}

const HTTP_STATUS = {
  'OK': 200,
  'BAD_REQUEST': 400,
  'UNAUTHORIZED': 401,
  'FORBIDDEN': 403,
  'NOT_FOUND': 404,
  'SERVER_ERROR': 500
}; // eslint-disable-next-line no-unused-vars

exports.HTTP_STATUS = HTTP_STATUS;
const OBJECT_TYPE = {
  datasource: 'data',
  schema: 'schema',
  table: 'table',
  attribute: 'attribute'
};
exports.OBJECT_TYPE = OBJECT_TYPE;
//# sourceMappingURL=index.js.map