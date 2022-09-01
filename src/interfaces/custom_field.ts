import {AlationEntityId, CustomFieldId, ObjectType} from '../types';

export interface ICustomFieldValue<V = any> {
  /**
   * id custom field
   */
  'field_id': CustomFieldId;
  /**
   * the type of object containing the field
   */
  'otype': ObjectType;
  /**
   * entity  id
   */
  'oid': AlationEntityId;
  /**
   * custom field value
   */
  'value': V;
}

export type ICustomFieldValueResponse<V = any> = {
  id: AlationEntityId;
  /**
   * id custom field
   */
  'field_id': CustomFieldId;
  /**
   * the type of object containing the field
   */
  'otype': ObjectType;
  /**
   * entity  id
   */
  'oid': AlationEntityId;
  /**
   * custom field value
   */
  'value': V;
};

export type ICustomFieldValueDeleteResponse = {
  /**
   * id custom field
   */
  'field_id': CustomFieldId;
  /**
   * the type of object containing the field
   */
  'otype': ObjectType;
  /**
   * entity  id
   */
  'oid': AlationEntityId;
  /**
   * custom field value
   */
  'value': string;
  'canonical_name': string;
  'catalog_set_title': any;
  'id': AlationEntityId;
}
