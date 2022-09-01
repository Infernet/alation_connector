import {AlationEntityId} from 'src';
import {IArticleChildrenObjectType} from 'src';

export interface IChildrenField {
  'id': AlationEntityId;
  'otype': IArticleChildrenObjectType;
  'title': string;
  'url': string;
}

export interface IAttachmentField {
  'otype': string;
  'title': string;
  'description': string;
  'download_url': string;
  'id': AlationEntityId;
}

export interface ICustomTemplate {
  'id': AlationEntityId;
  'title': string;
}

export interface IEditorField {
  'id': AlationEntityId;
  'display_name': string;
  'email': string;
  'url': string;
  'username': string;
}

export interface IUserField {
  'id': AlationEntityId;
  'display_name': string;
  'email': string;
  'url': string;
}

export interface IAuthorField extends IUserField {
  'username': string;
}
