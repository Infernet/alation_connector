export type Flag = true;

export type CustomFieldId = number;

export type AlationEntityId = number;

export type AlationEntityType = 'datasource' | 'schema' | 'table' | 'attribute' | 'article';

export type ObjectType = 'data' | 'schema' | 'table' | 'attribute' | 'article' | 'user' | 'group';

export type AlationKey<T extends string = string> = T;

export enum JobStatusEnum {
  // eslint-disable-next-line no-unused-vars
  RUNNING = 'running',
  // eslint-disable-next-line no-unused-vars
  FAILED = 'failed',
  // eslint-disable-next-line no-unused-vars
  SUCCESSFUL = 'successful',
}

export enum TokenStatusEnum {
  // eslint-disable-next-line no-unused-vars
  ACTIVE = 'ACTIVE',
  // eslint-disable-next-line no-unused-vars
  EXPIRED = 'EXPIRED',
  // eslint-disable-next-line no-unused-vars
  REVOKED = 'REVOKED',
}
