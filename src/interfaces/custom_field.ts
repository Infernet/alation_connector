import {AlationEntityId, CustomFieldId, ObjectType} from '../types';

export interface IEditCustomFieldValue<V = any> {
  'field_id': CustomFieldId;
  'otype': ObjectType;
  'oid': AlationEntityId;
  'value': V;
}

export type IEditCustomFieldValueRequest<V = any> = Omit<IEditCustomFieldValue<V>, 'otype'>;

export type IEditCustomFieldValueResponse = {
  'new_field_values': number;
  'updated_field_values': number;
  'field_values_received': number;
};
