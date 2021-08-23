import {AlationEntityType, ObjectType} from 'src';

export const ALATION_NEXT_PAGE_HEADER_KEY = 'x-next-page';

// eslint-disable-next-line no-unused-vars
export const ALATION_CATALOG_ROUTE: { [x in AlationEntityType]: string } = {
  datasource: '/catalog/datasource',
  schema: '/catalog/schema',
  table: '/catalog/table',
  attribute: '/catalog/column',
};

// eslint-disable-next-line no-unused-vars
export const ALATION_UPDATE_ROUTE: { [x in AlationEntityType]: string } = {
  datasource: '/api/v1/bulk_metadata/custom_fields/default/datasource?replace_values=true',
  schema: '/api/v1/bulk_metadata/custom_fields/default/schema?replace_values=true',
  table: '/api/v1/bulk_metadata/custom_fields/default/table?replace_values=true',
  attribute: '/api/v1/bulk_metadata/custom_fields/default/attribute?replace_values=true',
};

export const ALATION_JOB_STATE_ROUTE = '/api/v1/bulk_metadata/job/';

export const CUSTOM_FIELD_VALUE_EDIT_ROUTE = `/integration/v2/custom_field_value/`;

export function alationCreateRoute(datasourceId: number): string {
  return `api/v1/bulk_metadata/extraction/${datasourceId}?set_title_descs=true`;
}

export function regenerateRefreshTokenRoute(baseUrl: string): string {
  return `${baseUrl}/integration/v1/regenRefreshToken/`;
}

export function createRefreshTokenRoute(baseUrl: string): string {
  return `${baseUrl}/integration/v1/createRefreshToken/`;
}

export function createAccessTokenRoute(baseUrl: string): string {
  return `${baseUrl}/integration/v1/createAPIAccessToken/`;
}

export function validateAccessTokenRoute(baseUrl: string): string {
  return `${baseUrl}/integration/v1/validateAPIAccessToken/`;
}

export function validateRefreshTokenRoute(baseUrl: string): string {
  return `${baseUrl}/integration/v1/validateRefreshToken/`;
}

export const HTTP_STATUS = {
  'OK': 200,
  'BAD_REQUEST': 400,
  'UNAUTHORIZED': 401,
  'FORBIDDEN': 403,
  'NOT_FOUND': 404,
  'SERVER_ERROR': 500,
};

// eslint-disable-next-line no-unused-vars
export const OBJECT_TYPE: { [x in AlationEntityType]: ObjectType } = {
  datasource: 'data',
  schema: 'schema',
  table: 'table',
  attribute: 'attribute',
};
