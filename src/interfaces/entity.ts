import {AlationEntityId} from '../types';

export interface IAlationEntity<CustomFields extends ICustomField = ICustomField> {
  'id': AlationEntityId;
  'title': string;
  'description': string;
  'url': string;
  'custom_fields': Array<CustomFields>;
}

export interface ICustomField<N extends string = string, T extends string = string, V extends string = string> {
  'value': V;
  'value_type': T;
  'field_name': N;
}
