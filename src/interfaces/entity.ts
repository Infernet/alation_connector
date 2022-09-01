import {AlationEntityId} from '../types';

export interface IAlationEntity {
  'id': AlationEntityId;
}

export interface ICustomField<N extends string = string, T extends string = string, V extends string = string> {
  'value': V;
  'value_type': T;
  'field_name': N;
}
